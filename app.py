from flask import Flask, render_template, redirect, request, url_for, send_from_directory, after_this_request, send_file, session
import os, shutil, uuid

app = Flask(__name__)

app.secret_key = "KAWDIOSJNWDAISDJWNALOSKW"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/create", methods=["GET", "POST"])
def create():

    if request.method == "GET":
        return render_template("create.html")

    siteParts = request.get_json()

    clean_data = {}
    for key, value in siteParts.items():
        clean_key = key.lstrip('#').lstrip('.') 
        clean_data[clean_key] = value

    html = render_template(
        "siteCode.html",
        data=clean_data
    )

    filename = "siteCode2.html"
    path = f"static/{filename}"

    fold_id = uuid.uuid4()

    cartella_utente = "website_temp" + str(fold_id)
    fold_no_ext = os.path.join("downloads", cartella_utente)

    os.makedirs("downloads", exist_ok=True)

    with open(path, "w", encoding="utf-8") as f:
        f.write(html)

    os.makedirs(fold_no_ext, exist_ok=True)

    index = os.path.join(fold_no_ext, "index.html")

    with open("static/siteCode2.html", "r", encoding="utf-8") as f_old:
        contenuto = f_old.read()

    with open(index, "w", encoding="utf-8") as f_new:
        f_new.write(contenuto)

    with open("static/css/template-one-style.css", "r", encoding="utf-8") as f_css_old:
        css_content = f_css_old.read()
    style = css_content.replace("../img/", "img/")

    with open(os.path.join(fold_no_ext, "style.css"), "w", encoding="utf-8") as f_css_new:
        f_css_new.write(style)

    with open("static/template-one-script.js", "r", encoding="utf-8") as f_js_old:
        js_content = f_js_old.read()
    with open(os.path.join(fold_no_ext, "script.js"), "w", encoding="utf-8") as f_js_new:
        f_js_new.write(js_content)

    imgs_sorgente = "static/img"

    img_destinazione = os.path.join(fold_no_ext, "img")

    shutil.copytree(imgs_sorgente, img_destinazione, dirs_exist_ok=True)

    shutil.make_archive(fold_no_ext, 'zip', fold_no_ext)
    
    shutil.rmtree(fold_no_ext)
    
    cuZip = cartella_utente + ".zip"

    session["cartella_utente"] = cuZip

    return {
        "success": True,
    }

@app.route('/template-one-index')
def anteprima():
    return render_template("user-templates/template-one/template-one-index.html")


@app.route("/downloads")
def download_file():
    """fPath = os.path.join("downloads", "website_temp.zip")
    @after_this_request
    def rem_zip(response):
        try:
            os.remove(fPath)
        except Exception as error:
            print(f"Not able tu run code because of: {error}")
        return response"""
    
    cartella_utente = session.get("cartella_utente")

    if cartella_utente:
        return send_from_directory(
            directory="downloads",
            path=cartella_utente,
            as_attachment=True
        )
    else:
        return "Nessun file trovato", 404
    


if __name__ == '__main__':
    app.run(debug=True)