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

export default class Booth {
  shaders = {
    phong: new defs.Phong_Shader(),
    ring: new Ring_Shader(),
    image: new Textured_Phong(),
  };

  shapes = {
    roof: new defs.Closed_Cone(15, 15),
    poles: new defs.Rounded_Capped_Cylinder(500, 500),
    table: new Cube(),
    bucket: new defs.Cylindrical_Tube(100, 100),
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
    red_table: new Material(this.shaders.phong, {
      ambient: 1,
      diffusivity: 1,
      color: hex_color("#CF0000"),
    }),
    red_stripes: new Material(this.shaders.image, {
      color: hex_color("#000000"),
      ambient: 1,
      diffusivity: 0.1,
      specularity: 0.1,
      texture: new Texture("assets/stripes.png", "NEAREST"),
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
    white: new Material(this.shaders.phong, {
      ambient: 1,
      diffusivity: 1,
      color: hex_color("#CFBFAF"),
    }),
    darts_table: new Material(this.shaders.image, {
      color: hex_color("#000000"),
      ambient: 1,
      diffusivity: 0.1,
      specularity: 0.1,
      texture: new Texture("assets/balloondarts.png"),
    }),
    // ring_toss_table: new Material(this.shaders.image, {
    //   color: hex_color("#000000"),
    //   ambient: 1,
    //   diffusivity: 0.1,
    //   specularity: 0.1,
    //   texture: new Texture("assets/ringtoss.png"),
    // }),
    ducks_table: new Material(this.shaders.image, {
      color: hex_color("#000000"),
      ambient: 1,
      diffusivity: 0.1,
      specularity: 0.1,
      texture: new Texture("assets/ducks.png"),
    }),
    food_table: new Material(this.shaders.image, {
      color: hex_color("#000000"),
      ambient: 1,
      diffusivity: 0.1,
      specularity: 0.1,
      texture: new Texture("assets/food.png"),
    }),
    bucket_table: new Material(this.shaders.image, {
      color: hex_color("#000000"),
      ambient: 1,
      diffusivity: 0.1,
      specularity: 0.1,
      texture: new Texture("assets/buckets.png"),
    }),
    bottle_toss_table: new Material(this.shaders.image, {
      color: hex_color("#000000"),
      ambient: 1,
      diffusivity: 0.1,
      specularity: 0.1,
      texture: new Texture("assets/bottle.png"),
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
        .times(Mat4.translation(pos_x, pole_height, pos_z)) // above ground
        .times(Mat4.scale(0.1, pole_scale, 0.1)) // skinny
        .times(Mat4.rotation(Math.PI / 2, 1, 0, 0)); // to make it vertical
      let pole2_transform = Mat4.identity() // back left pole
        .times(
          Mat4.translation(pos_x - stand_size, pole_height, pos_z - stand_size)
        ) // above ground
        .times(Mat4.scale(0.1, pole_scale, 0.1)) // skinny
        .times(Mat4.rotation(Math.PI / 2, 1, 0, 0)); // to make it vertical
      let pole3_transform = Mat4.identity() // front left pole
        .times(Mat4.translation(pos_x - stand_size, pole_height, pos_z)) // above ground
        .times(Mat4.scale(0.1, pole_scale, 0.1)) // skinny
        .times(Mat4.rotation(Math.PI / 2, 1, 0, 0)); // to make it vertical
      let pole4_transform = Mat4.identity() // back right pole
        .times(Mat4.translation(pos_x, pole_height, pos_z - stand_size)) // above ground
        .times(Mat4.scale(0.1, pole_scale, 0.1)) // skinny
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
      const ref = 6;
      const roof_transform = Mat4.identity()
        .times(Mat4.translation(booth_center_x, ref, booth_center_z)) // so it's not on the floor
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
      } else if (roof_color == "white") {
        this.shapes.roof.draw(
          context,
          program_state,
          roof_transform,
          this.materials.white
        );
      }

      const scale = roof_size / 2 + 0.5;
      const pos_x = booth_center_x + scale;
      const pos_z = booth_center_z + scale;
      const pole_dist = roof_size + 1;
      draw_poles(context, program_state, pos_x, pos_z, pole_dist, ref - 1);

      let table_transform = Mat4.identity();
      if (table_color !== "darts") {
        table_transform = table_transform
          .times(Mat4.translation(booth_center_x, 1.5, booth_center_z))
          .times(Mat4.rotation(Math.PI / 2, 0, 1, 0))
          .times(Mat4.scale(scale, 1, 1));
      } else {
        table_transform = table_transform
          .times(Mat4.translation(booth_center_x, 1.5, booth_center_z))
          .times(Mat4.scale(scale, 1, 1));
      }

      if (table_color == "plain") {
        this.shapes.table.draw(
          context,
          program_state,
          table_transform,
          this.materials.red_stripes
        );
      } else if (table_color == "darts") {
        this.shapes.table.draw(
          context,
          program_state,
          table_transform,
          this.materials.darts_table
        );
      } else if (table_color == "bottletoss") {
        this.shapes.table.draw(
          context,
          program_state,
          table_transform,
          this.materials.bottle_toss_table
        );
      } else if (table_color == "ducks") {
        this.shapes.table.draw(
          context,
          program_state,
          table_transform,
          this.materials.ducks_table
        );
      } else if (table_color == "food") {
        this.shapes.table.draw(
          context,
          program_state,
          table_transform,
          this.materials.food_table
        );
      }
    };

    if (this.shapes != null && this.materials != null) {
      let roof_size = 4; // how big should the booth be
      let booth_center_x = 15; // x coordinate of booth center
      let booth_center_z = 5; // z coordinate of booth center
      let roof_color = "red";
      let table_color = "plain";
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
      booth_center_x = -5;
      booth_center_z = 0;
      roof_color = "blue";
      table_color = "darts";
      draw_booth(
        context,
        program_state,
        booth_center_x,
        booth_center_z,
        roof_size,
        roof_color,
        table_color
      );

      booth_center_x = 5;
      booth_center_z = 0;
      let table_transform = Mat4.identity()
        .times(Mat4.translation(booth_center_x, 1.5, booth_center_z))
        .times(Mat4.scale(2, 1, 1));
      this.shapes.table.draw(
        context,
        program_state,
        table_transform,
        this.materials.bucket_table
      );

      table_transform = table_transform
        .times(Mat4.translation(0, 1.5, 0))
        .times(Mat4.scale(0.75, 1, 1))
        .times(Mat4.rotation(Math.PI / 2, 1, 0, 0));
      this.shapes.bucket.draw(
        context,
        program_state,
        table_transform,
        this.materials.yellow
      );
      roof_size = 3;
      booth_center_x = -15;
      booth_center_z = 5;
      roof_color = "yellow";
      table_color = "plain";
      draw_booth(
        context,
        program_state,
        booth_center_x,
        booth_center_z,
        roof_size,
        roof_color,
        table_color
      );
      roof_size = 4;
      booth_center_x = -15;
      booth_center_z = 13;
      roof_color = "white";
      table_color = "ducks";
      draw_booth(
        context,
        program_state,
        booth_center_x,
        booth_center_z,
        roof_size,
        roof_color,
        table_color
      );
      roof_size = 3;
      booth_center_x = -15;
      booth_center_z = 21;
      roof_color = "blue";
      table_color = "plain";
      draw_booth(
        context,
        program_state,
        booth_center_x,
        booth_center_z,
        roof_size,
        roof_color,
        table_color
      );
      roof_size = 4;
      booth_center_x = -15;
      booth_center_z = 30;
      roof_color = "red";
      table_color = "food";
      draw_booth(
        context,
        program_state,
        booth_center_x,
        booth_center_z,
        roof_size,
        roof_color,
        table_color
      );
      roof_size = 4;
      booth_center_x = 15;
      booth_center_z = 15;
      roof_color = "yellow";
      table_color = "bottletoss";
      draw_booth(
        context,
        program_state,
        booth_center_x,
        booth_center_z,
        roof_size,
        roof_color,
        table_color
      );
      roof_size = 3;
      booth_center_x = 15;
      booth_center_z = 23;
      roof_color = "blue";
      table_color = "plain";
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
      booth_center_x = 15;
      booth_center_z = 32.5;
      roof_color = "white";
      table_color = "plain";
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
