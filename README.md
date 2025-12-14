Perfect 👍
Below is the **FULL, CLEAN, FINAL rewrite of *ALL RAML FILES*** for your project
👉 **`employee-api-new`**, with **examples written in RAML (not JSON)**, exactly so you can **double-check once and move on**.

You can copy–paste **as-is**.

---

# 📁 FINAL RAML FILE SET (COMPLETE)

Location for all files:

```
src/main/resources/api/
```

---

## 1️⃣ `employee-api.raml` (MAIN RAML)

```raml
#%RAML 1.0
title: Employee API
version: v1
protocols: [ HTTPS ]
baseUri: https://localhost:8081

uses:
  common: libraries/common-lib.raml

securedBy: [ common.mtls ]

/employees:
  type: common.collection

  get:
    is: [ common.pagination ]
    description: Get all employees
    responses:
      200:
        body:
          application/json:
            type: common.Employee[]
            example: !include examples/employee-response-example.raml

  post:
    description: Create a new employee
    body:
      application/json:
        type: common.Employee
        example: !include examples/employee-request-example.raml
    responses:
      201:
        body:
          application/json:
            type: common.Employee
            example: !include examples/employee-response-single-example.raml

  /{id}:
    uriParameters:
      id:
        type: integer
        description: Employee ID

    get:
      description: Get employee by ID
      responses:
        200:
          body:
            application/json:
              type: common.Employee
              example: !include examples/employee-response-single-example.raml

    put:
      description: Update employee by ID
      body:
        application/json:
          type: common.Employee
          example: !include examples/employee-request-example.raml
      responses:
        200:
          body:
            application/json:
              type: common.Employee
              example: !include examples/employee-response-single-example.raml

    delete:
      description: Delete employee by ID
      responses:
        204:
```

---

## 2️⃣ `libraries/common-lib.raml`

```raml
#%RAML 1.0 Library

types:
  Employee: !include ../datatypes/Employee.raml

traits:
  pagination: !include ../traits/pagination.raml

resourceTypes:
  collection: !include ../resourceTypes/collection.raml

securitySchemes:
  mtls: !include ../security/mtls.raml
```

---

## 3️⃣ `datatypes/Employee.raml`

```raml
#%RAML 1.0 DataType
type: object
properties:
  id?:
    type: integer
  name:
    type: string
  email:
    type: string
  department:
    type: string
  salary:
    type: number
```

---

## 4️⃣ `traits/pagination.raml`

```raml
#%RAML 1.0 Trait
queryParameters:
  limit?:
    type: integer
    default: 10
    description: Number of records to return
  offset?:
    type: integer
    default: 0
    description: Starting record index
```

---

## 5️⃣ `resourceTypes/collection.raml`

```raml
#%RAML 1.0 ResourceType
get:
  description: Get collection of resources
post:
  description: Create a new resource
```

(Simple by design — mentor wants **usage**, not over-engineering.)

---

## 6️⃣ `security/mtls.raml`

```raml
#%RAML 1.0 SecurityScheme
type: x-custom
description: Mutual TLS authentication
describedBy:
  headers:
    X-Client-Cert:
      description: Client certificate is required
```

⚠️ Reminder:
Actual mTLS is enforced in **HTTPS Listener**, not here.
This is **contract declaration**, which mentors expect.

---

## 7️⃣ `examples/employee-request-example.raml`

```raml
#%RAML 1.0 NamedExample
value:
  name: John Doe
  email: john.doe@company.com
  department: IT
  salary: 60000
```

---

## 8️⃣ `examples/employee-response-example.raml` (LIST)

```raml
#%RAML 1.0 NamedExample
value:
  - id: 1
    name: John Doe
    email: john.doe@company.com
    department: IT
    salary: 60000
```

---

## 9️⃣ `examples/employee-response-single-example.raml`

```raml
#%RAML 1.0 NamedExample
value:
  id: 1
  name: John Doe
  email: john.doe@company.com
  department: IT
  salary: 60000
```

---

## 🔟 (Optional but Nice) `annotations/audit.raml`

```raml
#%RAML 1.0 AnnotationType
usage: API audit metadata
properties:
  owner: string
  createdBy: string
```

(Not mandatory, but shows maturity if mentor notices.)

---

# ✅ FINAL VERIFICATION CHECKLIST

Before moving forward, confirm:

✔ RAML validates in Studio
✔ No red underline in any RAML
✔ All `!include` paths correct
✔ APIKit Router → **Update from RAML** works
✔ No `api-2` flows created

If all ✔ → **RAML is DONE forever**.

---

## 🧠 What you can confidently say to your mentor

> “I designed the entire Employee CRUD API upfront using RAML 1.0 with DataTypes, Traits, ResourceTypes, Libraries, Security Schemes, and NamedExample fragments, and then implemented it using APIKit.”

That’s a **strong, correct statement**.

---

### Next (tell me what you want)

* 🔹 Mule CRUD implementation (DB flows)
* 🔹 Two-way TLS configuration
* 🔹 Mule client for mTLS demo
* 🔹 Full mentor demo walkthrough

Just say the word 👍
