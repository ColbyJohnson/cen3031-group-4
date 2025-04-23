from flask import Blueprint, request, jsonify
from models import db, Application, Job, User

app_bp = Blueprint('application', __name__)

@app_bp.route('/applications', methods=['POST'])
def submit_application():
    data = request.json
    user_id = data.get('user_id')
    job_id = data.get('job_id')

    if not user_id or not job_id:
        return jsonify({'message': 'Missing user_id or job_id'}), 400

    # Check for duplicate application
    existing = Application.query.filter_by(user_id=user_id, job_id=job_id).first()
    if existing:
        return jsonify({'message': 'Already applied to this job'}), 400

    app = Application(user_id=user_id, job_id=job_id)
    db.session.add(app)
    db.session.commit()
    return jsonify({'message': 'Application submitted successfully'}), 201

@app_bp.route('/applications/user/<int:user_id>', methods=['GET'])
def get_user_applications(user_id):
    apps = Application.query.filter_by(user_id=user_id).all()
    result = [{
        'application_id': app.id,
        'job_id': app.job_id,
        'status': app.status
    } for app in apps]
    return jsonify(result)

@app_bp.route('/applications/job/<int:job_id>', methods=['GET'])
def get_job_applicants(job_id):
    apps = Application.query.filter_by(job_id=job_id).all()
    result = [{
        'application_id': app.id,
        'user_id': app.user_id,
        'status': app.status
    } for app in apps]
    return jsonify(result)

@app_bp.route('/applications/<int:application_id>', methods=['PUT'])
def update_application_status(application_id):
    app = Application.query.get(application_id)
    if not app:
        return jsonify({'message': 'Application not found'}), 404

    data = request.json
    status = data.get('status')
    if status:
        app.status = status
        db.session.commit()
        return jsonify({'message': 'Status updated'})
    else:
        return jsonify({'message': 'No status provided'}), 400
