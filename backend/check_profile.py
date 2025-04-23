from app import app, db
from models import Profile

with app.app_context():
    profile = Profile.query.filter_by(user_id=4).first()
    print(profile)
    if profile:
        print("Skills:", profile.skills)
    else: 
        print("No profile found")