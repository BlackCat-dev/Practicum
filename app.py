from flask import Flask
from flask import render_template, request, redirect
import get_text_from_pdf
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy as sa
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__, template_folder='template', static_folder='static')
app.config['SECRET_KEY'] = ''
app.config['SQLALCHEMY_DATABASE_URI'] = ''
db = SQLAlchemy(app)
socketio = SocketIO(app)
    
class Meddocument086(db.Model):
    __tablename__ = "meddocument086"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), default="")
    city = db.Column(db.String(128), default="")
    street = db.Column(db.String(255), default="")
    house = db.Column(db.String(255), default="")
    flat = db.Column(db.String(255), default="")
    placeofwork = db.Column(db.String(255), default="")
    diseases = db.Column(db.String(255), default="")
    vaccinations = db.Column(db.String(255), default="")
    
class Meddocument095(db.Model):
    __tablename__ = "meddocument095"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), default="")
    date = db.Column(db.String(255), default="")
    diseases = db.Column(db.String(255), default="")
    contacts = db.Column(db.String(255), default="")
    
class Meddocument027(db.Model):
    __tablename__ = "meddocument027"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), default="")
    date = db.Column(db.String(255), default="")
    city = db.Column(db.String(128), default="")
    street = db.Column(db.String(255), default="")
    house = db.Column(db.String(255), default="")
    flat = db.Column(db.String(255), default="")
    placeofwork = db.Column(db.String(255), default="")
    datesoftreatment = db.Column(db.String(255), default="")
    diagnosis = db.Column(db.String(255), default="")
    
class Meddocument079(db.Model):
    __tablename__ = "meddocument079"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), default="")
    city = db.Column(db.String(128), default="")
    street = db.Column(db.String(255), default="")
    house = db.Column(db.String(255), default="")
    flat = db.Column(db.String(255), default="")
    placeofwork = db.Column(db.String(255), default="")
    diseases = db.Column(db.String(255), default="")
    vaccinations = db.Column(db.String(255), default="")
    
with app.app_context():
        db.create_all()

page_dict = {"meddocument086": Meddocument086, "meddocument095": Meddocument095, "meddocument027": Meddocument027, "meddocument079": Meddocument079}
update_dict = {"update_meddocument086": Meddocument086, "update_meddocument095": Meddocument095, "update_meddocument027": Meddocument027, "update_meddocument079": Meddocument079}
newstr_dict = {"new_line_meddocument086": Meddocument086, "new_line_meddocument095": Meddocument095, "new_line_meddocument027": Meddocument027, "new_line_meddocument079": Meddocument079}
add_data_from_link_dict = {"addDataFromLink": Meddocument086}

@app.route('/', methods = ['GET', 'POST'])
def document():
    return redirect('/meddocument')
    
    
@app.route('/<path>', methods=['POST', 'GET'])
def general_page_handler(path):
    if path in page_dict:
        our_class = page_dict[path]
        try:
            query = db.session.query(our_class)
            row = query.all()
            attributes = [i for i in our_class.__dict__.keys() if i[:1] != '_']
            attributes.remove('id')
            template = '{file_name}.html'.format(file_name=path)
            return render_template(template, row=row,  attributes=attributes)
        except Exception:
            return 'Exception'
    elif path in update_dict:
        our_class = update_dict[path]
        if request.method == 'POST':
            field = request.form['field']
            value = request.form['value']
            editid = request.form['id']

            query = db.session.query(our_class)
            changeable = query.filter_by(id=editid).first()
            changeable.__setattr__(field, value)

            db.session.commit()
            return redirect('/')
        else:
            return 'Error while updating'
    elif path in newstr_dict:
        our_class = newstr_dict[path]
        try:
            if request.method == 'POST':
                idNumber = request.form['id']

                new_str = our_class(id = idNumber)

                db.session.add(new_str)
                db.session.commit()
            return redirect('/')
        except Exception as e:
            print(e)
    elif path in add_data_from_link_dict:
        our_class = add_data_from_link_dict[path]
        try:
            if request.method == 'POST':
                idNumber = request.form['id']
                file = request.files['form_data']
                get_text_from_pdf.get_text(file)
            return redirect('/')
        except Exception as e:
            print(e)
    else:
        return 'Exception general_page_handler'

if __name__ == '__main__':
    socketio.run(app, debug=True)