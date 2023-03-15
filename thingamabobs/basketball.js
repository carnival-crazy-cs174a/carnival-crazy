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
  Texture,
  Scene,
} = tiny;

export default class Basketball {
  constructor(location, color) {
    this.shader = new defs.Phong_Shader();
    this.materials = {
      ball: new Material(new defs.Textured_Phong(), {
        color: hex_color("#000000"), // black background color
        ambient: 0.4,
        diffusivity: 1,
        specularity: 0.2,
        texture: new Texture(
          "../assets/basketball.jpg",
          "LINEAR_MIPMAP_LINEAR"
        ),
      }),
    };
    this.shapes = {
      //   tip: new defs.Rounded_Closed_Cone(50, 50),
      //   shaft: new defs.Subdivision_Sphere(5),
      //   flight: new defs.Rounded_Closed_Cone(50, 50),
      ball: new defs.Subdivision_Sphere(8),
    };

    this.default_transforms = {
      //   tip: Mat4.scale(0.12, 0.12, 0.12)
      //     .times(Mat4.translation(0, 0, -4))
      //     .times(Mat4.rotation(Math.PI, 1, 0, 0)),
      //   shaft: Mat4.scale(0.1, 0.1, 0.6),
      //   flight: Mat4.scale(0.2, 0.2, 0.2)
      //     .times(Mat4.translation(0, 0, 3))
      //     .times(Mat4.rotation(Math.PI, 1, 0, 0)),
      //        ball: Mat4.scale(0.3, 0.3, 0.3).times(Mat4.rotation(this.time_bb, 0, 0, 1)),
      ball: Mat4.scale(0.3, 0.3, 0.3),
    };

    this.color = color;
    this.update_location(location);

    this.bounding_volume = new defs.Subdivision_Sphere(2);
    this.leeway = 0.1;

    this.wireframe_color = new Material(this.shader, {
      color: hex_color("#ffffff"),
      ambient: 1,
    });
    this.time_bb = 0;
  }

  update_location(location) {
    this.location = location;
    this.location_and_transform = this.location.times(
      this.default_transforms.ball
    );
  }

  draw(context, program_state, location) {
    this.update_location(location);
    const t = program_state.animation_time / 1000;
    const dt = program_state.animation_delta_time / 1000;
    console.log("t is " + t);
    console.log("dt is " + dt);
    //    let ball_transform = Mat4.identity();
    const gravity = -3.9;
    const init_height = 3;
    const velocity = 5.5;
    this.time_bb = this.time_bb + dt;
    console.log("this.time_bb is " + this.time_bb);
    let ball_y =
      init_height +
      velocity * this.time_bb +
      0.5 * gravity * this.time_bb * this.time_bb;
    //    let throw_bb_transform = throw_basketball ?
    const ball_transform = this.location.times(this.default_transforms.ball);
    // const ball_transform = (Mat4.translation(this.time_bb, ball_y, 10)).times(Mat4.scale(0.3, 0.3, 0.3)).times(Mat4.rotation(this.time_bb, 0, 0, 1)).times((this.location).times(this.default_transforms.ball));
    //    console.log("throw_bb: " + this.throw_bb);
    // console.log("Ball height " + ball_y);
    //ball_transform = (Mat4.translation(this.time_bb, ball_y, 10)).times(Mat4.scale(0.3, 0.3, 0.3)).times(Mat4.rotation(this.time_bb, 0, 0, 1)).times(ball_transform);    // T * S * R * I
    this.shapes.ball.draw(
      context,
      program_state,
      ball_transform,
      this.materials.ball
    );
    // const tip_transform = this.location.times(this.default_transforms.tip);
    // const shaft_transform = this.location.times(this.default_transforms.shaft);
    // const flight_transform = this.location.times(
    //   this.default_transforms.flight
    // );
    // const shaft_material = new Material(this.shader, {
    //   ambient: 1,
    //   color: this.color,
    // });
    // const tip_material = new Material(this.shader, {
    //   ambient: 0.8,
    //   color: this.color,
    // });

    // this.shapes.tip.draw(context, program_state, tip_transform, tip_material);
    // this.shapes.shaft.draw(
    //   context,
    //   program_state,
    //   shaft_transform,
    //   shaft_material
    // );
    // this.shapes.flight.draw(
    //   context,
    //   program_state,
    //   flight_transform,
    //   tip_material
    // );

    /**
     * Draw bounding volume for debugging
     */
    // const size = vec3(1 + this.leeway, 1 + this.leeway, 1 + this.leeway);
    // this.bounding_volume.draw(
    //   context,
    //   program_state,
    //   this.location_and_transform.times(Mat4.scale(...size)),
    //   this.wireframe_color,
    //   "LINE_STRIP"
    // );
  }
}

/*
import { defs, tiny, Texture } from "../examples/common.js";

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

export default class Basketball {
    constructor() {
       // console.log("throw_basketball: " + throw_basketball);
     //   this.throw_bb = throw_basketball;
        this.shader = new defs.Phong_Shader();
        this.shapes = {
            // tunnel: new defs.Cylindrical_Tube(50,50),   // could this somehow make a hole in the square?
            // base: new defs.Cube(),
            // // roof: see if can make square pyramid
            // chimney: new defs.Cube(),
            ball: new defs.Subdivision_Sphere(8),
        }
        this.materials = {
            ball: new Material(new defs.Textured_Phong(),
            {
                color: hex_color("#000000"), // black background color
                ambient: 0.4,
                diffusivity: 1, 
                specularity: 0.2,
                texture: new Texture("../assets/basketball.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
        }
        this.time_bb = 0;
    }
    draw(context, program_state) {
        const t = program_state.animation_time / 1000;
        const dt = program_state.animation_delta_time / 1000;
        console.log("t is " + t);
        console.log("dt is " + dt);
        let ball_transform = Mat4.identity();
        const gravity = -1.2;
        const init_height = 3;
        const velocity = 4;
        this.time_bb = this.time_bb + dt;
        console.log("this.time_bb is " + this.time_bb)
        let ball_y = init_height + velocity*this.time_bb + 0.5*gravity*this.time_bb*this.time_bb;
    //    let throw_bb_transform = throw_basketball ? 
    //    console.log("throw_bb: " + this.throw_bb);
        // console.log("Ball height " + ball_y);
        ball_transform = (Mat4.translation(this.time_bb, ball_y, 10)).times(Mat4.scale(0.3, 0.3, 0.3)).times(Mat4.rotation(this.time_bb, 0, 0, 1)).times(ball_transform);    // T * S * R * I
        this.shapes.ball.draw(context, program_state, ball_transform, this.materials.ball);
      //  ball_transform = (Mat4.translation(0, init_height, 10)).times(Mat4.scale(0.3, 0.3, 0.3)).times(ball_transform);    // T * S * I
       // ball_transform = Mat4.scale(0.3, 0.3, 0.3).times(ball_transform);    // S * I
      //  this.shapes.ball.draw(context, program_state, ball_transform, this.materials.ball);
    }

}
*/
