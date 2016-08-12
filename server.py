import sys, os
import web
import json
base_path = os.path.dirname(__file__)
sys.path.append(base_path)
web.config.debug = False

# Manage routing from here. Regex matches URL and chooses class by name
urls = (
    '/', 'Home',
    '/request', 'Speaker',
    '/reset', 'Reset',
)
render = web.template.render(base_path)
app = web.application(urls, globals())
session = web.session.Session(app, web.session.DiskStore('sessions'), initializer={'count': 0})

class Home:
    def GET(self):
        return render.example()


class Speaker:
    def POST(self):
        return self.GET()

    def GET(self):
        session.count += 1
        request = web.input()
        if request.has_key("msg"):
            message = "({0}): {1}".format(session.count, " ".join(request.msg.split(" ")[::-1]))
        else:
            message = "({0}): `msg` key missing from request".format(session.count)

        web.header("Content-Type", "application/json")
        response = {"msg": message}
        return json.dumps(response)


class Reset:
    def GET(self):
        session.kill()
        return ""


# For development testing, uncomment these 3 lines
if __name__ == "__main__":
    app.run()
