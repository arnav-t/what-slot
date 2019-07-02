
$(function () {
    $("#search-bar").autocomplete({
        source: "/search/",
        // minLength: 3,
    });
}
);

function clearTT() {
    for (var i = 0; i < 5; ++i) {
        for (var j = 0; j < 9; ++j) {
            $('#' + i.toString() + j.toString()).removeClass('border border-danger');
            $('#' + i.toString() + j.toString()).html('');
        }
    }
}

function sdCallback(data, id, course) {
    $('#details-div').html("");
    if (typeof data['Name'] !== "undefined") {
        if (id === undefined) {
            var details = "";
            details += "<b>Name: </b>" + data['Name'] + " <br>";
            courseData = data['Data'];
            for (var key in courseData) {
                details += "<b>" + key + ": </b>" + courseData[key] + " <br>";
            }
            $('#details-div').html(details);

            // Update timetable
            clearTT();
            for (var slot in courseData['Slot']) {
                $('#' + courseData['Slot'][slot]).addClass('border border-danger');
                $('#' + courseData['Slot'][slot]).html(data['Name'].split(':')[0])
            }
        }
        else {
            parentList = document.getElementById(id);
            var item = document.createElement('li');
            item.className = "course";
            item.setAttribute("onclick", "searchData(this)");
            item.innerHTML = course;
            parentList.appendChild(item);
        }
    }
}

function clearSelected() {
    $('.active').removeClass('active');
}


function searchData(q = $("#search-bar").val(), id = undefined) {
    var searchString = "";
    clearSelected();
    if (typeof q !== "string") {
        searchString = q.innerHTML; // Get list item's name
        q.className += ' active';
    }
    else {
        searchString = q;
    }
    $.post("/ajax/",
        {
            "query": searchString
        },
        function (data) {
            sdCallback(data, id, searchString);
        },
        "json"
    );
}

$("#search-but").click(searchData);
$("#search-bar").on('keypress', function (e) {
    if (e.which === 13) {
        $(this).attr("disabled", "disabled");
        searchData();
        $(this).removeAttr("disabled");
    }
});

function loadMinor() {
    $.get("/minor/", function (data) {
        minorDiv = document.getElementById('minor-div');
        var jdata = JSON.parse(data);
        for (var i in jdata) {
            var minor = jdata[i];

            // Create heading
            var heading = document.createElement('h3');
            heading.className = "accordion";
            heading.innerHTML = "<i data-feather='chevron-down'></i>" + minor['Name'];
            heading.addEventListener(
                'click',
                function (e) {
                    var elem = $(e.target)[0].nextElementSibling;
                    $(elem).toggleClass('open');
                    e.target.removeChild(e.target.childNodes[0]);
                    innerHTML = e.target.innerHTML;
                    if ($(elem).hasClass('open')) {
                        e.target.innerHTML = "<i data-feather='chevron-right'></i>" + innerHTML;
                    } else {
                        e.target.innerHTML = "<i data-feather='chevron-down'></i>" + innerHTML;
                    }
                    feather.replace();
                } //onclick displays course list of each dept
                , false
            )
            minorDiv.appendChild(heading);

            // Create list
            var list = document.createElement('ul');
            list.className = "panel";
            list.id = i.toString();

            // Populate list
            for (var j in minor['Courses']) {
                course = minor['Courses'][j];
                searchData(course, i.toString());
            }

            // Add to page
            minorDiv.appendChild(list);
        }
        new SimpleBar(minorDiv, { autoHide: false });
    }).promise().done(
        () => {
            feather.replace()
        }
    );
}

loadMinor();
setTimeout(
    () => {
        new SimpleBar($('.ui-menu')[0]);

    }, 1000

)

function toggle(el) {
    element = $(el);
    if (element.hasClass('table-danger'))
        element.removeClass('table-danger');
    else
        element.addClass('table-danger');
}

$('#timet td').attr('onclick', 'toggle(this)');

function readICS() {
    var file = document.getElementById('file-in').files[0];
    if (file) {
        $('#timet td').removeClass('table-danger');

        var reader = new FileReader();
        reader.onload = function (e) {
            var content = e.target.result;
            var slots = content.split('DTSTART;TZID=Asia/Kolkata;VALUE=DATE-TIME:');
            for (i in slots) {
                var slot = slots[i];
                if (i > 0) {
                    var hour = parseInt(slot.substring(9, 11));
                    var year = parseInt(slot.substring(0, 4));
                    var month = parseInt(slot.substring(4, 6)) - 1;
                    var date = parseInt(slot.substring(6, 8));

                    var d = new Date(year, month, date);

                    var day = d.getDay() - 1;

                    var duration = parseInt(slot.substring(28, 29));

                    if (hour < 14)
                        hour -= 8;
                    else
                        hour -= 9;

                    for (var i = 0; i < duration; ++i) {
                        var id = day.toString() + (hour + i).toString();
                        $('#' + id).addClass('table-danger');
                    }

                }
            }
        }

        reader.readAsText(file);
    }
}



//toggle night/light mode
var button = false;
var lightColors = [
    '#ec3654',
    '#36c1ec',
    '#40d48f',
    '#b535ff',
    '#ff9913'
], darkColors = [
    '#12c571',
    '#1886e0',
    '#ff69b4',
    '#e63b58',
    '#b039ff'
]
function toggleDarkLight() {
    var mainColor = lightColors[0];
    if (button) {
        // Light mode colors
        button = false;
        mainColor = lightColors[Math.floor(Math.random() * lightColors.length)];
        $(".courses,.timetable").css("color", "black");

        document.documentElement.style
            .setProperty('--bg-color', 'white');
        document.documentElement.style
            .setProperty('--text-color', '#2e2e2e');

        document.documentElement.style
            .setProperty('--search-color', '#2e2e2e');
    }
    else {
        button = true;
        // Dark Mode colors
        mainColor = darkColors[Math.floor(Math.random() * darkColors.length)];

        $(".courses,.timetable").css("color", "#eee");
        document.documentElement.style
            .setProperty('--bg-color', '#2F304D');
        document.documentElement.style
            .setProperty('--text-color', '#e0e0e0');
        document.documentElement.style
            .setProperty('--search-color', '#2e2e2e');
    }
    document.documentElement.style
        .setProperty('--main-color', mainColor);
}
feather.replace()
