$( function() {
        $("#search-bar").autocomplete({
            source: "/search/",
            minLength: 3
        });
    } 
);