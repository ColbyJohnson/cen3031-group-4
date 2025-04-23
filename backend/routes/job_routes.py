from flask import Blueprint, request, jsonify
from models import db, Job, Profile
from sqlalchemy import or_

job_bp = Blueprint('job', __name__)

@job_bp.route('/jobs', methods=['POST'])
def create_job():
    data = request.json
    title = data.get('title')
    description = data.get('description')
    location = data.get('location')
    pay = data.get('pay')
    job_type = data.get('job_type')
    expiration_date = data.get('expiration_date')
    employer_id = data.get('employer_id')

    if not all([title, description, employer_id]):
        return jsonify({'message': 'Missing required fields'}), 400

    job = Job(
        title=title,
        description=description,
        location=location,
        pay=pay,
        job_type=job_type,
        expiration_date=expiration_date,
        employer_id=employer_id
    )
    db.session.add(job)
    db.session.commit()

    return jsonify({'message': 'Job created successfully', 'job_id': job.id}), 201

@job_bp.route('/jobs', methods=['GET'])
def get_all_jobs():
    jobs = Job.query.all()
    job_list = [{
        'id': job.id,
        'title': job.title,
        'description': job.description,
        'location': job.location,
        'pay': job.pay,
        'job_type': job.job_type,
        'expiration_date': job.expiration_date,
        'employer_id': job.employer_id
    } for job in jobs]
    return jsonify(job_list)

@job_bp.route('/jobs/<int:job_id>', methods=['GET'])
def get_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({'message': 'Job not found'}), 404
    return jsonify({
        'id': job.id,
        'title': job.title,
        'description': job.description,
        'location': job.location,
        'pay': job.pay,
        'job_type': job.job_type,
        'expiration_date': job.expiration_date,
        'employer_id': job.employer_id
    })

@job_bp.route('/jobs/<int:job_id>', methods=['PUT'])
def update_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({'message': 'Job not found'}), 404

    data = request.json
    job.title = data.get('title', job.title)
    job.description = data.get('description', job.description)
    job.location = data.get('location', job.location)
    job.pay = data.get('pay', job.pay)
    job.job_type = data.get('job_type', job.job_type)
    job.expiration_date = data.get('expiration_date', job.expiration_date)

    db.session.commit()
    return jsonify({'message': 'Job updated successfully'})

@job_bp.route('/jobs/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({'message': 'Job not found'}), 404

    db.session.delete(job)
    db.session.commit()
    return jsonify({'message': 'Job deleted successfully'})

@job_bp.route('/jobs/search', methods=['GET'])
def search_jobs():
    keyword = request.args.get('keyword', '').lower()
    location = request.args.get('location')
    job_type = request.args.get('job_type')
    pay = request.args.get('pay')

    query = Job.query

    if keyword:
        query = query.filter(or_(
            Job.title.ilike(f"%{keyword}%"),
            Job.description.ilike(f"%{keyword}%")
        ))

    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    if job_type:
        query = query.filter(Job.job_type.ilike(f"%{job_type}%"))
    if pay:
        query = query.filter(Job.pay.ilike(f"%{pay}%"))

    jobs = query.all()
    results = [{
        'id': job.id,
        'title': job.title,
        'description': job.description,
        'location': job.location,
        'pay': job.pay,
        'job_type': job.job_type,
        'expiration_date': job.expiration_date,
        'employer_id': job.employer_id
    } for job in jobs]

    return jsonify(results)

@job_bp.route('/jobs/match/<int:user_id>', methods=['GET'])
def match_jobs(user_id):
    profile = Profile.query.filter_by(user_id=user_id).first()
    if not profile or not profile.skills:
        return jsonify({'message': 'Profile with skills not found'}), 404

    skills = profile.skills.lower().split(',')

    # Very basic keyword match in job descriptions and titles
    jobs = Job.query.all()
    matched_jobs = []

    for job in jobs:
        job_text = f"{job.title} {job.description}".lower()
        if any(skill.strip() in job_text for skill in skills):
            matched_jobs.append({
                'id': job.id,
                'title': job.title,
                'description': job.description,
                'location': job.location,
                'pay': job.pay,
                'job_type': job.job_type,
                'expiration_date': job.expiration_date,
                'employer_id': job.employer_id
            })

    return jsonify(matched_jobs)
