import { defs, tiny } from "../examples/common.js";
import { Ring_Shader } from "../shaders.js";
const {
    Vector,
    Vector3,
    vec,
    vec3,
    vec4,
    color,
    hex_color,
    Shader,
    Matrix,
    Mat4,
    Light,
    Shape,
    Material,
    Scene,
} = tiny;


export default class Dart {
    body = {
        shape: new defs.Subdivision_Sphere(5),
        default_transform: Mat4.scale(0.1, 0.1, .6),
    };


    transform = Mat4.scale(.1, .1, .3);


    neck = {
        shape: new defs.Rounded_Closed_Cone(50, 50),
        default_transform: Mat4.scale(0.12, 0.12, 0.12)
            .times(Mat4.translation(0, 0, 4))
            .times(Mat4.rotation((3 * Math.PI) / 2, 0, 0, 2)),
    };
    neck2 = {
        shape: new defs.Rounded_Closed_Cone(50, 50),
        default_transform: Mat4.scale(0.2, 0.2, 0.2)
            .times(Mat4.translation(0, 0, -3))
            .times(Mat4.rotation((3 * Math.PI) / 2, 0, 0, 2)),
    };


    constructor() {
        this.shader = new defs.Phong_Shader();
    }


    draw(context, program_state, location, color) {
        const body_transform = location.times(this.body.default_transform);
        const neck_transform = location.times(this.neck.default_transform);
        const neck2_transform = location.times(this.neck2.default_transform);
        const body_material = new Material(this.shader, {
            ambient: 1,
            color,
        });
        const neck_material = new Material(this.shader, {
            ambient: 0.8,
            color,
        });


        this.body.shape.draw(context, program_state, body_transform, body_material);
        this.neck.shape.draw(context, program_state, neck_transform, neck_material);
        this.neck2.shape.draw(context, program_state, neck2_transform, neck_material);
    }
}

