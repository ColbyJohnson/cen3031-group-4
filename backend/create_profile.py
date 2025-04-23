from app import app, db
from models import Profile

with app.app_context():
    profile = Profile(
        user_id=4,
        skills="cleaning, cleaner, janitor",
        experience="3 years of cleaning experience",
        contact_info="cleaner@example.com",
        resume_filename="resume.pdf"
    )
    db.session.add(profile)
    db.session.commit()
    print("Profile created for user_id=4!")