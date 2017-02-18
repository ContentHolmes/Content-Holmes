Chart.defaults.global.defaultFontColor = "#1E1E20";
Chart.defaults.global.defaultFontFamily = " 'Roboto', sans-serif";
Chart.defaults.global.defaultFontSize = 14;
Chart.defaults.global.animation.easing = "easeOutCirc";
var ctx = document.getElementById("Child_Name_1_1");

var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "My First dataset",
            fill: true,
            lineTension: 0.1,
            backgroundColor: "rgba(52,152,219, 0.4)",
            borderColor: "rgba(52,152,219, 1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(52,152,219, 1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(52,152,219, 1)",
            pointHoverBorderColor: "rgba(231,76,60, 0)",
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            pointHitRadius: 10,
            data: [65, 59, -10, -20, 56, 55, 40],
            spanGaps: false,
        }]
    },
    options: {
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
var ctx = document.getElementById("Child_Name_1_2");
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "My First dataset",
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1,
            data: [65, 59, 80, 81, 56, 55, 10],
        }]
    },
    options: {
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
$(document).ready(function() {
    var toggle = true;
    var visible = false;
    var wid = $('.chat_bot').width();
    $(".pin_display").click(function() {
        if (visible) {
            $(".pin_hidden").css('visibility', 'hidden');
            visible = false;
        } else {
            visible = true;
                $(".pin_hidden").css('visibility', 'visible');
            // $(".pin_hidden").animate({
            //     visibility: 'visible'
            // }, 'fast');
        }
    });
    $(".toggle_button").click(function() {
        if (toggle) {
            $(".chat_bot").css('width', 'inherit');
            wid = $('.chat_bot').width();
            $(".chat_bot").animate({
                width: '0px'
            }, 'meduim');
            toggle = false;
        } else {
            $(".chat_bot").animate({
                width: wid
            }, 'meduim');
            // $(".chat_bot").css('width', 'inherit');
            toggle = true;
        }
    });
    $(".scroll").click(function() {
        var id = $(this).attr('id');
        console.log($(".main_content").find("#" + id.toString()).offset().top);
        $("#body").animate({
            scrollTop: $(".main_content").find("#" + id.toString()).offset().top
        }, 'slow');
    });
});
