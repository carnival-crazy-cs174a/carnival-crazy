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

export default class Candy {
    shaders = { phong: new defs.Phong_Shader(), ring: new Ring_Shader() };

    shapes = {
        roof: new defs.Subdivision_Sphere(3),
        poles: new defs.Rounded_Capped_Cylinder(500, 500)
    };

    materials = {
        poles: new Material(this.shaders.phong, {
            ambient: 0.4,
            diffusivity: 0.6,
            color: hex_color("#FFFFFF"),
        }),
        red_ring_roof: new Material(this.shaders.ring, {
            ambient: 0,
            diffusivity: 1,
            specularity: 1,
            color: hex_color("#FF0000"),
        }),

    };

    constructor() {}

    draw(context, program_state) {
        // Arrow function is necessary for `this` to be interpreted correctly
        // See https://stackoverflow.com/a/36526580
        const draw_poles = (
            context,
            program_state,
            pos_x,
            pos_z,
            stand_size,
            pole_scale
        ) => {
            const pole_height = pole_scale / 2 + 0.5;
            let pole1_transform = Mat4.identity() // right front pole
                .times(Mat4.translation(pos_x + 1, pole_height + 2, pos_z + .3)) // above ground
                .times(Mat4.scale(0.05, pole_scale/7, 0.05)) // skinny
                .times(Mat4.rotation(Math.PI / 2, 1, 0, 0)); // to make it vertical

            this.shapes.poles.draw(
                context,
                program_state,
                pole1_transform,
                this.materials.poles
            );

        };
        const draw_booth = (
            context,
            program_state,
            booth_center_x,
            booth_center_z,
            roof_size,
            roof_color
        ) => {
            const ref = 5;
            const roof_transform = Mat4.identity()
                .times(Mat4.translation(booth_center_x, ref, booth_center_z)) // so it's not on the floor
                .times(Mat4.scale(roof_size, roof_size, roof_size))
                .times(Mat4.rotation((3 * Math.PI) / 2, 1, 0, 0));
            if (roof_color == "red") {
                this.shapes.roof.draw(
                    context,
                    program_state,
                    roof_transform,
                    this.materials.red_ring_roof
                );
            }

            const scale = roof_size / 2 + 0.5;
            const pos_x = booth_center_x;
            const pos_z = booth_center_z + scale;
            const pole_dist = roof_size + 1;
            draw_poles(context, program_state, pos_x - 1, pos_z -1 , pole_dist, ref - 1);


        };

        if (this.shapes != null && this.materials != null) {

            let roof_size = .3;
            let booth_center_x = -10;
            let booth_center_z = 50;
            let roof_color = "red";
            draw_booth(
                context,
                program_state,
                booth_center_x,
                booth_center_z,
                roof_size,
                roof_color
            );

        }
    }
}
