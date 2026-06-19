# API Documentation

Base URL: `http://localhost:4000/api`

## Health Check

```
GET /health
```

**Response 200:**
```json
{
  "status": "ok",
  "service": "baby-math-backend"
}
```

---

## GET /api/problem

Fetch a math problem. Returns cached problem if available, otherwise generates via AI.

**Query Parameters:**
| Param | Type   | Required | Default | Description |
|-------|--------|----------|---------|-------------|
| level | string | no       | counting | Problem level: counting, addition_1, addition_2, subtraction_1, shapes |

**Example Request:**
```
GET /api/problem?level=counting
```

**Example Response 200:**
```json
{
  "problem_id": "abc-123-def-456",
  "prompt": "How many apples are there? 🍎🍎🍎",
  "choices": ["1", "2", "3", "4"],
  "correct_index": 2,
  "level": "counting"
}
```

**Error Response 500:**
```json
{
  "error": "Failed to generate problem",
  "detail": "All AI providers failed: ..."
}
```

**Contract:** CONTRACT-001

**Test command:**
```bash
cd backend && npx vitest run src/__tests__/problem.test.ts
```

---

## POST /api/answer

Submit an answer to a problem. Records session and returns calibration feedback.

**Request Body:**
| Field        | Type   | Required | Description                |
|-------------|--------|----------|----------------------------|
| problem_id  | string | yes      | ID from GET /api/problem   |
| answer_index| number | yes      | 0-based selected choice    |

**Example Request:**
```json
{
  "problem_id": "abc-123-def-456",
  "answer_index": 2
}
```

**Example Response 200 (Correct):**
```json
{
  "correct": true,
  "guide_text": "Great job! You solved it correctly at counting level!",
  "guide_visuals": ["star-burst", "check-mark"]
}
```

**Example Response 200 (Wrong):**
```json
{
  "correct": false,
  "guide_text": "Count each item slowly. Point to each one as you count.",
  "guide_visuals": ["counting-fingers", "dots-visual"]
}
```

**Error Response 400:**
```json
{
  "error": "problem_id and answer_index required"
}
```

**Error Response 404:**
```json
{
  "error": "Problem not found"
}
```

**Contract:** CONTRACT-002

**Test command:**
```bash
cd backend && npx vitest run src/__tests__/answer.test.ts
```

---

## GET /api/performance

Get performance data across all sessions. No PIN required.

**Example Request:**
```
GET /api/performance
```

**Example Response 200:**
```json
{
  "currentLevel": "counting",
  "accuracyByLevel": [
    {
      "level": "counting",
      "total": 15,
      "correct": 12,
      "accuracy": 80
    },
    {
      "level": "addition_1",
      "total": 5,
      "correct": 4,
      "accuracy": 80
    }
  ],
  "sessions": [
    {
      "problemId": "abc-123",
      "correct": true,
      "level": "counting",
      "timestamp": "2026-06-19T03:00:00.000Z"
    }
  ],
  "streak": 3,
  "totalSessions": 20
}
```

**Contract:** CONTRACT-003

**Test command:**
```bash
cd backend && npx vitest run src/__tests__/performance.test.ts
```

---

## GET /api/parent/dashboard

Parent dashboard with performance data. Requires PIN header.

**Headers:**
| Header          | Type   | Required | Default | Description          |
|----------------|--------|----------|---------|----------------------|
| x-dashboard-pin| string | yes      | 0000    | 4-digit parent PIN   |

**Example Request:**
```
GET /api/parent/dashboard
x-dashboard-pin: 0000
```

**Example Response 200:**
```json
{
  "currentLevel": "counting",
  "accuracyByLevel": [
    {
      "level": "counting",
      "total": 15,
      "correct": 12,
      "accuracy": 80
    }
  ],
  "sessions": [],
  "streak": 3,
  "totalSessions": 15,
  "pinProtected": true
}
```

**Error Response 401:**
```json
{
  "error": "Invalid or missing PIN"
}
```

---

## Testing with curl

```bash
# Health check
curl http://localhost:4000/health

# Get a problem
curl "http://localhost:4000/api/problem?level=counting"

# Submit an answer (replace problem_id)
curl -X POST http://localhost:4000/api/answer \
  -H "Content-Type: application/json" \
  -d '{"problem_id":"abc-123","answer_index":2}'

# Get performance
curl http://localhost:4000/api/performance

# Get parent dashboard
curl -H "x-dashboard-pin: 0000" http://localhost:4000/api/parent/dashboard
```
