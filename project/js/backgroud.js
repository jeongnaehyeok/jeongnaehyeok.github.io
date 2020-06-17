const chefname = document.getElementById('chefname');
const color_list= ['--black', '--black_sub', '--gray', '--gray_sub', '--red', '--red_sub', '--orange', '--orange_sub', '--yellow', '--yellow_sub', '--green', '--green_sub', '--bluegreen', '--bluegreen_sub', '--blue', '--blue_sub', '--purple', '--purple_sub']
const random = () => {
    return parseInt(Math.random() * 18);
}
const changecolor = () => {
    return `var(${color_list[random()]})`;
}

chefname.onclick = () => {
    document.body.style.background = changecolor();
}
