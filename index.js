var request = require('request');
var fs = require('fs');

var config;
var userstories;

var argv = require('minimist')(process.argv.slice(2));

fs.readFile("config.json", 'utf8', function (err, data) {
    config = JSON.parse(data);
    if (argv.userstories_file) {
        config.userstories_file = argv.userstories_file
    }
    fs.readFile(config.userstories_file, 'utf8', function (err, data) {
        userstories = JSON.parse(data);
        login();
    });
});


var user = {};
var project = {};
var project_userstories = {};
var points = {};
var roles = {};

function login() {
    request({
        "method": "POST",
        "url": config.url + config.endpoints.auth,
        "Content-Type": 'application/json',
        "formData": {
            type: "normal",
            username: config.user.username,
            password: config.user.password
        }
    }, function (error, response, body) {
        user = JSON.parse(body);
        getProject();
    });
}

var methods = {
    userstories: {
        get_all_and_delete: function () {
            var requestData = {
                "method": "GET",
                "url": config.url + config.endpoints.userstories + project.id,
                'auth': {
                    'bearer': user.auth_token
                }
            };
            request(requestData, function (error, response, body) {
                project_userstories  = JSON.parse(body);
                for (var i = 0; i < project_userstories.length; i++) {
                    methods.userstories.delete(project_userstories[i]);
                }
            });
        },
        add: function(us) {
            var p = {};

            for (var role in us.points) {
                p[roles[role].id] = points[us.points[role]].id;
            }

            var requestData = {
                "method": "POST",
                "url": config.url + config.endpoints.userstories,
                'auth': {
                    'bearer': user.auth_token
                },
                "Content-Type": 'application/json',
                "formData": {
                    project: project.id,
                    subject: us.subject,
                    description: us.description,
                    points: JSON.stringify(p)
                }
            };

            request(requestData, function (error, response, body) {
                var body = JSON.parse(body);
                console.log("#"+body.ref, "AGREGADO", " - ID:", body.id);
            });
        },
        delete: function (us) {
            var requestData = {
                "method": "DELETE",
                "url": config.url + config.endpoints.userstory + us.id,
                'auth': {
                    'bearer': user.auth_token
                }
            };
            request(requestData, function (error) {
                if (error == null) {
                    console.log("#"+us.ref, "BORRADO ", " - ID:", us.id);
                }
            });
        }
    }
};


function getProject() {
    var requestData = {
        "method": "GET",
        "url": config.url + config.endpoints.project_slug + config.project.slug,
        'auth': {
            'bearer': user.auth_token
        }
    };
    request(requestData, function (error, response, body) {
        project = JSON.parse(body);

        if (argv['delete-userstories'] == "true") {
            methods.userstories.get_all_and_delete();
        }

        for (var i = 0; i < project.points.length; i++) {
            points[project.points[i].value] = {id: project.points[i].id};
        }
        for (var i = 0; i < project.roles.length; i++) {
            roles[project.roles[i].slug] = {id: project.roles[i].id};
        }
        for (var i = 0; i < userstories.length; i++) {
            methods.userstories.add(userstories[i]);
        }
    });
}
