# InterviewAI Server

[Nest](https://github.com/nestjs/nest) Server for an AI interviewer
## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 🎉 Features

- **REST Endpoints**  
  - `POST /api/upload` → create new interview record  
  - `POST /api/chat`   → handle each chat message via OpenAI  
  - `GET  /api/feedback/:feedbackId` → fetch stored feedback  
  - `POST /api/feedback` → generate & persist feedback  

- **Interview Flow Logic**  
  - On `__start__` → load resume & JD, ask question #1  
  - On each subsequent message → include full history, ask next question  
  - After 5 questions → instruct user to “End Interview”  


## AI Integration (OpenAI)
- **Chat Completions**  
  - Uses `gpt-3.5-turbo` for Q&A  
  - System prompts to enforce “5 technical questions” rule 
 
- **Feedback Generation**  
  - Uses `gpt-3.5-turbo` (or Chat API) to analyze transcript  
  - Persists feedback in DB for retrieval
 
- **Data Access**  
  - `@supabase/supabase-js` client wrapped in `SupabaseService`  
  - Insert/select on every chat turn and feedback generation  


## Database Schema

![supabase_schema](https://github.com/user-attachments/assets/76810643-7248-4c11-ad70-6ad0200586d2)


## interviews

| Column         | Type            | Constraints                        |
| -------------- | --------------- | ---------------------------------- |
| **id**         | BIGINT       | PRIMARY KEY                        |
| **created_at** | TIMESTAMPTZ     | NOT NULL, DEFAULT NOW()            |
| **job_desc_text** | TEXT         | NOT NULL                           |
| **resume_text**   | TEXT         | NOT NULL                           |

## messages

| Column         | Type            | Constraints                                               |
| -------------- | --------------- | --------------------------------------------------------- |
| **id**         | BIGSERIAL       | PRIMARY KEY                                               |
| **timestamp**  | TIMESTAMPTZ     | NOT NULL, DEFAULT NOW()                                   |
| **interview_id** | BIGINT        | NOT NULL, REFERENCES interviews(id) ON DELETE CASCADE     |
| **role**       | TEXT            | NOT NULL                                                  |
| **content**    | TEXT            | NOT NULL                                                  |

## feedback

| Column         | Type            | Constraints                                               |
| -------------- | --------------- | --------------------------------------------------------- |
| **id**         | BIGSERIAL       | PRIMARY KEY                                               |
| **timestamp**  | TIMESTAMPTZ     | NOT NULL, DEFAULT NOW()                                   |
| **interview_id** | BIGINT        | NOT NULL, REFERENCES interviews(id) ON DELETE CASCADE     |
| **feedback_text** | TEXT         | NOT NULL                                                  |

## Indexes

- CREATE INDEX ON messages(interview_id);

- CREATE INDEX ON feedback(interview_id);

```sql





## Environment Variables

Create a `.env` file in the project root and set the following three keys, for the purpose of this interview I am making my supabase project env keys public so that, it is easier to run, will disable the keys and generate new ones after 2-3 days

```dotenv
# Your Supabase project URL
SUPABASE_URL=********************************

# Your Supabase Service Role key (or anon key, if preferred)
SUPABASE_KEY=********************************

# Your OpenAI secret key
OPENAI_API_KEY=sk-********************************




