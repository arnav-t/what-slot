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
            $( '#' + i.toString() + j.toString() ).removeClass('border border-info');
            $( '#' + i.toString() + j.toString() ).html( '' );
        }
    }
}

function searchData()
{
    $.post("/ajax/",
    {
        query: $( "#search-bar" ).val()
    },
    function(data, status){
        $( '#details-div' ).html("");
        if( data['Name'] !== undefined )
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
                $( '#' + courseData['Slot'][slot]).addClass('border border-info');
                $( '#' + courseData['Slot'][slot]).html( data['Name'].split(':')[0] )
            }
        }
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