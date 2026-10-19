# ZYVEN Task Engine & Submissions

## Task Engine Architecture
The task engine supports 19 task types without requiring separate database tables for each type:
`QUIZ`, `MCQ`, `UPLOAD`, `PPT`, `DOCUMENT`, `IMAGE`, `VIDEO`, `URL`, `TEXT`, `COURSE_COMPLETION`, `CERTIFICATE`, `SCREENSHOT`, `FORM`, `SURVEY`, `EVENT`, `REFERRAL`, `SOCIAL_MEDIA`, `MULTI_STEP`, `HYBRID`.

### Task Studio Workflow
1. Basic Details (Title, Description, Category)
2. Task Type
3. Step Builder (Step 1, Step 2, etc.)
4. Requirement Definition (Files, URLs, Screenshots, Quizzes)
5. Audience Targeting:
   - `public`: Visible to everyone
   - `all_students`: All active students
   - `college`: Filtered by `college_id`
   - `selected_students`: Filtered by `task_recipients`
6. Google Form & Google Spreadsheet Integration:
   - Tasks can specify direct registration or attendance tracking URLs.
7. Point Allocation:
   - Maximum 25 points for Ambassador created tasks.
   - Admin tasks can allocate arbitrary points.
8. Approval Lifecycle:
   - `draft` -> `pending_approval` -> `live` (by Admin)
   - Or `changes_requested` / `rejected`.

## Submission & Review Engine
1. Student clicks "Start Task" -> creates `in_progress` record in `submissions`.
2. Student submits proof items (links, uploaded files, screenshots) -> status changes to `submitted`.
3. Ambassador / Admin reviews in `/ambassador/submissions`:
   - `approve`: Triggers PostgreSQL atomic transaction `review_submission`.
   - `changes_requested`: Student can re-upload or update proof.
   - `reject`: Marked rejected with feedback.
4. Duplicate Protection:
   - The PostgreSQL `unique_submission_points` constraint on `(submission_id, type)` guarantees an approved task can never award points more than once.
