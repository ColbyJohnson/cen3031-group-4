# Group 4 Repo for CEN3031 Project

# **Project Summary**

Many job seekers struggle to find job opportunities suited to their skills. Existing job platforms are not tailored to small businesses or gig work, making it harder for some workers to connect with employers. Our solution is this:

**A job-matching platform that helps job seekers find local gigs and full-time positions. Employers can post jobs, and users can create profiles to match with relevant openings.**

---

# **Core Features**

1.  **User Authentication:**
    Secure registration and login using email authentication.

2.  **Job Listings:**
    Employers post jobs with position, location, pay rate, job type, and expiration dates.

3.  **Profile & Resume Upload:**
    Job seekers create detailed profiles and upload resumes.

4.  **Job Matching System:**
    Matches based on skills, experience, and location; employers get candidate suggestions.

5.  **Search & Filters:**
    Jobs searchable by keyword, location, and job type.

6.  **Application Tracking:**
    Job seekers track application status; employers monitor applicants.

---

# **Screenshots**

Here are some visual representations of the platform:

### Dashboard
![Dashboard Screenshot](Dashboard.png)

### Login
![Login Screenshot](Login.png)

### Register
![Register Screenshot](register.png)

---

# **Installation Guide**

To set up the Community Job Matching Platform on your local machine, follow the steps below.

**Prerequisites**

Before starting, ensure that you have the following software installed:

* **Python 3.x** – Required for the backend setup.
* **Node.js** (for the frontend) – Required for the React application.
* **Git** – Required for cloning the repository.
* **pip** – Required for installing Python dependencies.
* **npm** – Required for installing JavaScript dependencies.

**Steps**

1.  **Clone the Repo:**
    ```bash
    git clone [https://github.com/colbyjohnson/cen3031-group-4.git](https://github.com/colbyjohnson/cen3031-group-4.git)
    cd cen3031-group-4
    ```

2.  **Backend Setup:**
    Navigate to the backend folder and install dependencies:
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

3.  **Configure the Database:**
    Run the following Python code to create the database tables:
    ```python
    from app import db
    db.create_all()
    ```
    This will create the required tables: `User`, `Profile`, `Job`, and `Application`.

4.  **Run the Flask Backend:**
    ```bash
    python app.py
    ```
    This will run the backend server on `http://localhost:5000`.

5.  **Frontend Setup:**
    Navigate to the frontend folder:
    ```bash
    cd ../frontend
    ```

6.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

7.  **Run the Frontend Application:**
    ```bash
    npm start
    ```
    This will run the frontend application on `http://localhost:3000`.

8.  **Access the Application:**
    * **Frontend:** Open a browser and go to `http://localhost:3000`. You should see the main page of the Community Job Matching Platform.
    * **Backend API:** The backend API is running on `http://localhost:5000`, handling requests for registration, login, job posting, profile creation, job matching, and application submissions.

---

# **Team Members & Roles**

* **William Johnson** - Frontend Development and Design
* **Logan Burtis** - Backend Support and Software Debugger
* **Sung Hong** - Backend Developer
* **Safeah Hammosh** - Frontend Support and Scrum Master
