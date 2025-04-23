from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_employer = db.Column(db.Boolean, default=False)

    profile = db.relationship("Profile", backref="user", uselist=False)
    jobs = db.relationship("Job", backref="employer", lazy=True)
    applications = db.relationship("Application", backref="applicant", lazy=True)

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(100))
    pay = db.Column(db.String(100))
    job_type = db.Column(db.String(50))
    expiration_date = db.Column(db.String(100))

    employer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    applications = db.relationship("Application", backref="job", lazy=True)

class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True)
    skills = db.Column(db.Text)
    experience = db.Column(db.Text)
    contact_info = db.Column(db.String(255))
    resume_filename = db.Column(db.String(255))

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    job_id = db.Column(db.Integer, db.ForeignKey('job.id'))
    status = db.Column(db.String(100), default="Submitted")
