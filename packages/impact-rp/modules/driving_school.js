module.exports = {
    Init: () => {
        createDrivingSchoolMarker();
    }
}

function createDrivingSchoolMarker() {
<<<<<<< HEAD
    var pos = new mp.Vector3(-925.5, -2037, 8.40);
=======
    var pos = new mp.Vector3(-925.5, -2037, 9.40);
>>>>>>> 20cc6f6432fd463cf06d3de1da035802edeb6d40
    var marker = mp.markers.new(1, pos, 1, {
        color: [187, 255, 0, 70],
        visible: false
    });

    var blip = mp.blips.new(545, pos, {
        color: 0,
        name: "Автошкола",
        shortRange: 10,
        scale: 0.7
    });
    marker.blip = blip;

    //для стриминга
    var colshape = mp.colshapes.newCircle(pos.x, pos.y, 60);
    colshape.marker = marker;
    marker.showColshape = colshape;

    //для отловки события входа
    var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 2);
    colshape.drivingSchool = marker;
    marker.colshape = colshape;
    colshape.menuName = `enter_driving_school`;
}
