$( function() {
        $("#search-bar").autocomplete({
            source: "/search/",
            minLength: 3
        });
    } 
);

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