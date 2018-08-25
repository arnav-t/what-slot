$( function() {
        $("#search-bar").autocomplete({
            source: "/search/",
            minLength: 3
        });
    } 
);

function clearTT()
{
    for(var i = 0; i < 5; ++i)
    {
        for(var j = 0; j < 9; ++j)
        {
            $( '#' + i.toString() + j.toString() ).removeClass('border border-warning');
            $( '#' + i.toString() + j.toString() ).html( '' );
        }
    }
}

function sdCallback(data, id, course)
{
    $( '#details-div' ).html("");
    if( typeof data['Name'] !== "undefined" )
    {   
        if(id === undefined)
        {
            var details = "";
            details += "<b>Name: </b>" + data['Name'] + " <br>";
            courseData = data['Data'];
            for (var key in courseData)
            {
                details +="<b>" + key + ": </b>" + courseData[key] + " <br>";
            }
            $( '#details-div' ).html(details);

            // Update timetable
            clearTT();
            for (var slot in courseData['Slot'])
            {
                $( '#' + courseData['Slot'][slot]).addClass('border border-warning');
                $( '#' + courseData['Slot'][slot]).html( data['Name'].split(':')[0] )
            }
        }
        else
        {
            parentList = document.getElementById(id);
            var item = document.createElement('li');
            item.className = "list-group-item";
            item.setAttribute("onclick", "searchData(this)");
            item.innerHTML = course;
            parentList.appendChild(item);
        }
    }   
}

function clearSelected()
{
    $('.active').removeClass('active');
}


function searchData(q = $( "#search-bar" ).val(), id = undefined)
{
    var searchString = "";
    clearSelected();
    if(typeof q !== "string")
    {
        searchString = q.innerHTML; // Get list item's name
        q.className += ' active';
    }
    else
    {
        searchString = q;
    }
    $.post("/ajax/",
    {
        "query": searchString
    },
    function(data) {
        sdCallback(data, id, searchString);
    },
    "json"
    );
}

$( "#search-but" ).click( searchData );
$( "#search-bar" ).on('keypress', function(e) {
    if(e.which === 13)
    {
        $(this).attr("disabled", "disabled");
        searchData();
        $(this).removeAttr("disabled");
    }
});

function loadMinor()
{
    $.get("/minor/", function(data) {
        minorDiv = document.getElementById('minor-div');
        var jdata = JSON.parse(data);
        for (var i in jdata)
        {
            var minor = jdata[i];

            // Create heading
            var heading = document.createElement('h4');
            heading.innerHTML = minor['Name'];
            minorDiv.appendChild(heading);

            // Create list
            var list = document.createElement('ul');
            list.className = "list-group";
            list.id = i.toString();

            // Populate list
            for (var j in minor['Courses'])
            {
                course = minor['Courses'][j];
                searchData( course, i.toString() );
            }

            // Add to page
            minorDiv.appendChild(list);
        }
    });
}

loadMinor();

function toggle(el)
{
    element = $(el);
    if(element.hasClass('table-danger'))
        element.removeClass('table-danger');
    else
        element.addClass('table-danger');
}

$( '#timet td' ).attr('onclick', 'toggle(this)');

function readICS()
{
    var file = document.getElementById( 'file-in' ).files[0];
    if(file)
    {
        $( '#timet td' ).removeClass('table-danger');
        
        var reader = new FileReader();
        reader.onload = function(e) {
            var content = e.target.result;
            var slots = content.split('DTSTART;TZID=Asia/Kolkata;VALUE=DATE-TIME:'); 
            for ( i in slots )
            {
                var slot = slots[i];    
                if( i > 0 )
                { 
                    var hour = parseInt( slot.substring(9, 11) );
                    var year = parseInt( slot.substring(0,4) );
                    var month = parseInt( slot.substring(4,6) ) - 1;
                    var date = parseInt( slot.substring(6,8) );

                    var d = new Date(year, month, date);

                    var day = d.getDay() - 1;

                    var duration = parseInt( slot.substring(28, 29) );

                    if(hour < 14)
                        hour -= 8;
                    else 
                        hour -= 9;

                    for(var i = 0; i < duration; ++i)
                    {
                        var id = day.toString() + (hour + i).toString();
                        $( '#' + id ).addClass( 'table-danger' );
                    }

                }
            }
        }
        
        reader.readAsText(file);
    }
}
