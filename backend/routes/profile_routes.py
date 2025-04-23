from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from models import db, Profile, User
import os

profile_bp = Blueprint('profile', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@profile_bp.route('/profile/<int:user_id>', methods=['GET'])
def get_profile(user_id):
    profile = Profile.query.filter_by(user_id=user_id).first()
    if profile:
        return jsonify({
            'user_id': profile.user_id,
            'skills': profile.skills,
            'experience': profile.experience,
            'contact_info': profile.contact_info,
            'resume_filename': profile.resume_filename
        })
    else:
        return jsonify({'message': 'Profile not found'}), 404

@profile_bp.route('/profile', methods=['POST'])
def create_profile():
    user_id = int(request.form.get('user_id'))
    skills = request.form.get('skills')
    experience = request.form.get('experience')
    contact_info = request.form.get('contact_info')

    resume_file = request.files.get('resume')
    if resume_file and allowed_file(resume_file.filename):
        filename = secure_filename(resume_file.filename)
        path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        resume_file.save(path)
    else:
        filename = None

    profile = Profile.query.filter_by(user_id=user_id).first()
    if profile:
        return jsonify({'message': 'Profile already exists'}), 400

    new_profile = Profile(
        user_id=user_id,
        skills=skills,
        experience=experience,
        contact_info=contact_info,
        resume_filename=filename
    )
    db.session.add(new_profile)
    db.session.commit()
    return jsonify({'message': 'Profile created successfully'}), 201

@profile_bp.route('/profile/<int:user_id>', methods=['PUT'])
def update_profile(user_id):
    profile = Profile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({'message': 'Profile not found'}), 404

    skills = request.form.get('skills')
    experience = request.form.get('experience')
    contact_info = request.form.get('contact_info')
    resume_file = request.files.get('resume')

    if skills:
        profile.skills = skills
    if experience:
        profile.experience = experience
    if contact_info:
        profile.contact_info = contact_info
    if resume_file and allowed_file(resume_file.filename):
        filename = secure_filename(resume_file.filename)
        path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        resume_file.save(path)
        profile.resume_filename = filename

    db.session.commit()
    return jsonify({'message': 'Profile updated successfully'})
