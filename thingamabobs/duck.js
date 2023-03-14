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

export default class Duck {
    body = {
        shape: new defs.Subdivision_Sphere(5),
        default_transform: Mat4.scale(.3, .3, .4),
    };
    bodyBody = {
        shape: new defs.Subdivision_Sphere(5),
        default_transform: Mat4.scale(.35, .35, .5)
        .times(Mat4.translation(0, 1, -1.1)),
    };

    eye = {
        shape: new defs.Subdivision_Sphere(5),
        default_transform: Mat4.scale(.1, .1, .1).times(Mat4.translation(2.5, .2, 2.5)),
    };
    transform = Mat4.scale(0.1, 0.1, 0.3);

    neck = {
        shape: new defs.Rounded_Closed_Cone(50, 50),
        default_transform: Mat4.scale(0.15, 0.15, 0.15)
            .times(Mat4.translation(0, .1, 3))
            .times(Mat4.rotation((3 * Math.PI) / 2, 0, 0, 2)),
    };
    neck2 = {
        shape: new defs.Subdivision_Sphere(5),
        default_transform: Mat4.scale(0.1, 0.1, 0.1)
            .times(Mat4.translation(0, 0, -3)),
    };

    constructor() {
        this.shader = new defs.Phong_Shader();
    }

    draw(context, program_state, location, color) {
        location = location.times(Mat4.rotation(Math.PI, 1, 0, 0));
        const body_transform = location.times(this.body.default_transform);
        const bodyBody_transform = location.times(this.bodyBody.default_transform);
        const neck_transform = location.times(this.neck.default_transform);
        const neck2_transform = location.times(this.body.default_transform);
        const eye_transform = location.times(this.eye.default_transform);
        const yellow = hex_color("#FFFF00");
        const orange = hex_color("#ffa500");
        const body_material = new Material(this.shader, {
            ambient: 1,
                color: hex_color("#FFFF00"),
        });
        const beak_material = new Material(this.shader, {
            ambient: 0.8,
            color: hex_color("#FFA500"),
        });
        const neck_material2 = new Material(this.shader, {
            ambient: 0.8,
            color: hex_color("#FFA500"),
        });
        const eye_material = new Material(this.shader, {
            ambient: 0.8,
            color: hex_color("#000000"),
        });

        this.body.shape.draw(context, program_state, body_transform, body_material);
        this.neck.shape.draw(context, program_state, neck_transform, beak_material);
        this.bodyBody.shape.draw(context, program_state, bodyBody_transform, body_material);
        this.eye.shape.draw(context, program_state, eye_transform, eye_material);
        this.neck2.shape.draw(
            context,
            program_state,
            neck2_transform,
            beak_material
        );
    }
}
