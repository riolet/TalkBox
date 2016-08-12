import BaseHTTPServer
import SimpleHTTPServer
import urllib2

#name of imaginary server that responds to TalkBox requests
ECHO_SERVER_PATH = "echo_server"

class SampleHandler (SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path
        path = path.lstrip("/")
        if path.startswith(ECHO_SERVER_PATH):
            self.handle_message(path)
        else:
            SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)

    def handle_message(self, path):
        request = urllib2.urlparse.urlparse(path)
        data = urllib2.urlparse.parse_qsl(request.query)
        for item in data:
            if item[0] == "msg":
                break
        if len(data) == 0 or item[0] != "msg":
            response = "Malformed request. Please specify a message."
        else:
            response = self.generate_response(item[1])

        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.send_header("Content-length", len(response))
        self.end_headers()
        self.wfile.write(response)

    def generate_response(self, msg):
        # reverse the word order, just for fun.
        return " ".join(msg.split(" ")[::-1])

def run(server_class=BaseHTTPServer.HTTPServer,
        handler_class=BaseHTTPServer.BaseHTTPRequestHandler):
    server_address = ('', 8000)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()

if __name__ == "__main__":
    # run(handler_class=SampleHandler)
    run(handler_class=SampleHandler)
