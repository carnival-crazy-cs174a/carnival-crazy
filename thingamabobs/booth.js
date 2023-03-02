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

export default class Booth {
  shaders = { phong: new defs.Phong_Shader(), ring: new Ring_Shader() };

  shapes = {
    roof: new defs.Closed_Cone(15, 15),
    poles: new defs.Rounded_Capped_Cylinder(500, 500),
    table: new defs.Cube(),
  };

  materials = {
    poles: new Material(new defs.Phong_Shader(), {
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
    red_table: new Material(this.shaders.phong, {
      ambient: 1,
      diffusivity: 1,
      color: hex_color("#CF0000"),
    }),
    blue: new Material(this.shaders.phong, {
      ambient: 1,
      diffusivity: 1,
      color: hex_color("#077DDF"),
    }),
    yellow: new Material(this.shaders.phong, {
      ambient: 1,
      diffusivity: 1,
      color: hex_color("#F6D003"),
    }),
  };

  constructor() {}

  draw(context, program_state) {
    // Arrow function is necessary for `this` to be interpreted correctly
    // See https://stackoverflow.com/a/36526580
    const draw_poles = (context, program_state, pos_x, pos_z, stand_size) => {
      const pole_length = 4;
      let pole1_transform = Mat4.identity() // right front pole
        .times(Mat4.translation(pos_x, 2.5, pos_z)) // above ground
        .times(Mat4.scale(0.1, pole_length, 0.1)) // skinny
        .times(Mat4.rotation(Math.PI / 2, 1, 0, 0)); // to make it vertical
      let pole2_transform = Mat4.identity() // back left pole
        .times(Mat4.translation(pos_x - stand_size, 2.5, pos_z - stand_size)) // above ground
        .times(Mat4.scale(0.1, pole_length, 0.1)) // skinny
        .times(Mat4.rotation(Math.PI / 2, 1, 0, 0)); // to make it vertical
      let pole3_transform = Mat4.identity() // front left pole
        .times(Mat4.translation(pos_x - stand_size, 2.5, pos_z)) // above ground
        .times(Mat4.scale(0.1, pole_length, 0.1)) // skinny
        .times(Mat4.rotation(Math.PI / 2, 1, 0, 0)); // to make it vertical
      let pole4_transform = Mat4.identity() // back right pole
        .times(Mat4.translation(pos_x, 2.5, pos_z - stand_size)) // above ground
        .times(Mat4.scale(0.1, pole_length, 0.1)) // skinny
        .times(Mat4.rotation(Math.PI / 2, 1, 0, 0)); // to make it vertical

      this.shapes.poles.draw(
        context,
        program_state,
        pole1_transform,
        this.materials.poles
      );
      this.shapes.poles.draw(
        context,
        program_state,
        pole2_transform,
        this.materials.poles
      );
      this.shapes.poles.draw(
        context,
        program_state,
        pole3_transform,
        this.materials.poles
      );
      this.shapes.poles.draw(
        context,
        program_state,
        pole4_transform,
        this.materials.poles
      );
    };

    const draw_booth = (
      context,
      program_state,
      booth_center_x,
      booth_center_z,
      roof_size,
      roof_color,
      table_color
    ) => {
      const blue = "#077DDF";
      const yellow = hex_color("#F6D00");
      const roof_transform = Mat4.identity()
        .times(Mat4.translation(booth_center_x, 5, booth_center_z)) // so it's not on the floor
        .times(Mat4.scale(roof_size, 1, roof_size))
        .times(Mat4.rotation((3 * Math.PI) / 2, 1, 0, 0));
      if (roof_color == "red") {
        this.shapes.roof.draw(
          context,
          program_state,
          roof_transform,
          this.materials.red_ring_roof
        );
      } else if (roof_color == "blue") {
        this.shapes.roof.draw(
          context,
          program_state,
          roof_transform,
          this.materials.blue
        );
      } else if (roof_color == "yellow") {
        this.shapes.roof.draw(
          context,
          program_state,
          roof_transform,
          this.materials.yellow
        );
      }

      const scale = roof_size / 2 + 0.5;
      const pos_x = booth_center_x + scale;
      const pos_z = booth_center_z + scale;
      const pole_dist = roof_size + 1;
      draw_poles(context, program_state, pos_x, pos_z, pole_dist);

      const table_transform = Mat4.identity()
        .times(Mat4.translation(booth_center_x, 1.5, booth_center_z))
        .times(Mat4.scale(scale, 1, 1));
      if (table_color == "red") {
        this.shapes.table.draw(
          context,
          program_state,
          table_transform,
          this.materials.red_table
        );
      } else if (table_color == "yellow") {
        this.shapes.table.draw(
          context,
          program_state,
          table_transform,
          this.materials.yellow
        );
      } else if (table_color == "blue") {
        this.shapes.table.draw(
          context,
          program_state,
          table_transform,
          this.materials.solid.blue
        );
      }
    };

    if (this.shapes != null && this.materials != null) {
      let roof_size = 7; // how big should the booth be
      let booth_center_x = 10; // x coordinate of booth center
      let booth_center_z = 15; // z coordinate of booth center
      let roof_color = "red";
      let table_color = "red";
      draw_booth(
        context,
        program_state,
        booth_center_x,
        booth_center_z,
        roof_size,
        roof_color,
        table_color
      );
      roof_size = 5;
      booth_center_x = 0;
      booth_center_z = 0;
      roof_color = "blue";
      table_color = "yellow";
      draw_booth(
        context,
        program_state,
        booth_center_x,
        booth_center_z,
        roof_size,
        roof_color,
        table_color
      );
    }
  }
}
