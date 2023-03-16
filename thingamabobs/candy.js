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
    Texture,
} = tiny;
const { Cube, Textured_Phong } = defs;
export default class Candy {
    shaders = { phong: new defs.Phong_Shader(), ring: new Ring_Shader() };

    shapes = {
        roof: new defs.Subdivision_Sphere(3),
        poles: new defs.Rounded_Capped_Cylinder(500, 500),
        table: new Cube(),
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
        orange_ring_roof: new Material(this.shaders.ring, {
            ambient: 0,
            diffusivity: 1,
            specularity: 1,
            color: hex_color("#FFAE42"),
        }),
        red_stripes: new Material(this.shaders.image, {
            color: hex_color("#000000"),
            ambient: 1,
            diffusivity: 0.1,
            specularity: 0.1,
            texture: new Texture("assets/stripes.png", "NEAREST"),
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
                .times(Mat4.translation(pos_x + 1, pole_height + .5, pos_z + .3)) // above ground
                .times(Mat4.scale(0.05, pole_scale/4, 0.05)) // skinny
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
                .times(Mat4.translation(booth_center_x, ref -1.7, booth_center_z)) // so it's not on the floor
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
            if (roof_color == "orange") {
                this.shapes.roof.draw(
                    context,
                    program_state,
                    roof_transform,
                    this.materials.orange_ring_roof
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
            let booth_center_x = -15;
            let booth_center_z = 30;
            let roof_color = "red";
            draw_booth(
                context,
                program_state,
                booth_center_x,
                booth_center_z,
                roof_size,
                roof_color
            );
            //let roof_size = .3;
            //let booth_center_x = -15;
            booth_center_z = 29.3;
            roof_color = "orange";
            draw_booth(
                context,
                program_state,
                booth_center_x,
                booth_center_z,
                roof_size,
                roof_color
            );
            booth_center_z = 28.6;
            draw_booth(
                context,
                program_state,
                booth_center_x,
                booth_center_z,
                roof_size,
                roof_color
            );
            booth_center_z = 27.9;
            draw_booth(
                context,
                program_state,
                booth_center_x,
                booth_center_z,
                roof_size,
                roof_color
            );
            booth_center_z = 30.7;
            draw_booth(
                context,
                program_state,
                booth_center_x,
                booth_center_z,
                roof_size,
                roof_color
            );
            booth_center_z = 31.4;
            draw_booth(
                context,
                program_state,
                booth_center_x,
                booth_center_z,
                roof_size,
                roof_color
            );
            booth_center_z = 32.1;
            draw_booth(
                context,
                program_state,
                booth_center_x,
                booth_center_z,
                roof_size,
                roof_color
            );
            let table_transform = Mat4.identity();
            table_transform = table_transform
                .times(Mat4.translation(-15, 20, 27.9))
                .times(Mat4.scale(1, 1, 1));
            /*this.shapes.table.draw(
                context,
                program_state,
                table_transform,
                this.materials.red_stripes
            );*/


        }
    }
}
