exports.getdate = function(){
    var today = new Date();

    var options = {
        weekday: "long",
        month: "long",
        day: "numeric"
    };
    return today.toLocaleDateString("en-US", options);
}

exports.getday = function(){
    var today = new Date();

    var options = {
        weekday: "long",
    };
    return today.toLocaleDateString("en-US", options);
}