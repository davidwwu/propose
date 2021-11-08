const {
  gsap: { timeline, set, registerPlugin },
  ScrollTrigger,
} = window

registerPlugin(ScrollTrigger)

ScrollTrigger.addEventListener('refresh', () => {
  document.documentElement.scrollTop = 0
})

// Utility function - h/t to https://www.trysmudford.com/blog/linear-interpolation-functions/
const LERP = (x, y, a) => x * (1 - a) + y * a
const CLAMP = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a))
const INVLERP = (x, y, a) => CLAMP((a - x) / (y - x))
const RANGE = (x1, y1, x2, y2, a) => LERP(x2, y2, INVLERP(x1, y1, a))

// Main timeline

/**
 * Apple does nothing.
 * Overlay some text with a darker backdrop that covers the apple
 */
const TITLE_EL = document.querySelector('.section--title');
// const INTRO_EL = document.querySelector('.section--intro');
const get_secs_el = (num) => document.querySelector('.section--' + num);
const get_blurb_el = (num) => document.querySelector('.section--blurb' + num);
// const BLURB1_EL = document.querySelector('.section--blurb1');
const getPos = (el, pos) => {
  const BOUND = el.getBoundingClientRect()
  return BOUND.top + BOUND.height * pos
}

const TITLE = () =>
  timeline({
    scrollTrigger: {
      scrub: 0.5,
      trigger: '.section--title',
      pin: '.section--title .section__content',
      start: 'top top',
      end: 'bottom bottom'
    },
  })
    .set('.section--title .section__content .blurb p', {
      y: 0,
      opacity: 1,
    })
    .to('.section--title .section__content .blurb p', {
      scrollTrigger: {
        scrub: 0.5,
        trigger: '.section--title',
        start: () => getPos(TITLE_EL, 0.1),
        end: () => getPos(TITLE_EL, 0.2),
      },
    })
    .fromTo(
      '.section--title .section__content .blurb p',
      {
        y: 0,
        opacity: 1,
      },
      {
        y: '-=100%',
        opacity: 0,
        scrollTrigger: {
          scrub: 0.5,
          trigger: '.section--title',
          start: () => getPos(TITLE_EL, 0.3),
          end: () => getPos(TITLE_EL, 0.4),
        },
      }
    )
    .to(
      '.section--title .section__content',
      {
        scrollTrigger: {
          scrub: 0.5,
          trigger: '.section--title',
          start: () => getPos(TITLE_EL, 0.5),
          end: () => getPos(TITLE_EL, 0.6),
          onUpdate: self =>
            document.documentElement.style.setProperty(
              '--alpha',
              0.5 - self.progress / 2
            ),
        },
      },
      '<'
    );

// const INTRO = () =>
//   timeline({
//     scrollTrigger: {
//       scrub: 0.5,
//       trigger: '.section--intro',
//       pin: '.section--intro .section__content',
//       start: 'top top',
//       end: 'bottom bottom',
//     },
//   })
//     .set('.section--intro .section__content .text', {
//       y: '+=100%',
//       opacity: 0
//     })
//     .set('.section--intro .section__content .blurb p', {
//       y: '+=100%',
//       opacity: 0,
//     })
//     .to('.section--intro .section__content', {
//       scrollTrigger: {
//         scrub: 0.5,
//         trigger: '.section--intro',
//         start: 'top top',
//         end: 'top -=25%',
//         onUpdate: self =>
//           document.documentElement.style.setProperty(
//             '--alpha',
//             self.progress / 2
//           ),
//       },
//     })
//     .to('.section--intro .section__content .text', {
//       y: 0,
//       opacity: 1,
//       stagger: 0.1,
//       scrollTrigger: {
//         scrub: 0.5,
//         trigger: '.section--intro',
//         start: () => getPos(INTRO_EL, 0.1),
//         end: () => getPos(INTRO_EL, 0.2),
//       },
//     })
//     .fromTo(
//       '.section--intro .section__content .text',
//       {
//         y: 0,
//         opacity: 1,
//       },
//       {
//         y: '-=100%',
//         opacity: 0,
//         stagger: 0.1,
//         scrollTrigger: {
//           scrub: 0.5,
//           trigger: '.section--intro',
//           start: () => getPos(INTRO_EL, 0.3),
//           end: () => getPos(INTRO_EL, 0.4),
//         },
//       }
//     )
//     .to('.section--intro .section__content .blurb p', {
//       y: 0,
//       opacity: 1,
//       scrollTrigger: {
//         scrub: 0.5,
//         trigger: '.section--intro',
//         start: () => getPos(INTRO_EL, 0.5),
//         end: () => getPos(INTRO_EL, 0.6),
//       },
//     })
//     .fromTo(
//       '.section--intro .section__content .blurb p',
//       {
//         y: 0,
//         opacity: 1,
//       },
//       {
//         y: '-=100%',
//         opacity: 0,
//         scrollTrigger: {
//           scrub: 0.5,
//           trigger: '.section--intro',
//           start: () => getPos(INTRO_EL, 0.7),
//           end: () => getPos(INTRO_EL, 0.8),
//         },
//       }
//     )
//     .to(
//       '.section--intro .section__content',
//       {
//         scrollTrigger: {
//           scrub: 0.5,
//           trigger: '.section--intro',
//           start: () => getPos(INTRO_EL, 0.7),
//           end: () => getPos(INTRO_EL, 0.8),
//           onUpdate: self =>
//             document.documentElement.style.setProperty(
//               '--alpha',
//               0.5 - self.progress / 2
//             ),
//         },
//       },
//       '<'
//     );

const delSections = document.querySelectorAll(".delayed-section");

delSections.forEach(section => {
  const containerAnim = gsap.to(section.querySelector(".innerContainer"), {
    y: "100vh",
    ease: "none"
  });
  
  const imageAnim = gsap.to(section.querySelector("img"), {
    y: "-100vh",
    ease: "none",
    paused: true
  });
  
  const scrub = gsap.to(imageAnim, {
    progress: 1,
    paused: true,
    ease: "power3",
    duration: parseFloat(section.dataset.scrub) || 0.1,
    overwrite: true
  });
  
  ScrollTrigger.create({
    animation: containerAnim,
    scrub: true,
    trigger: section,
    start: "top bottom",
    end: "bottom top",
    onUpdate: self => {
      scrub.vars.progress = self.progress;
      scrub.invalidate().restart();
    }
  });
});

const BLURBS = (num) =>
  timeline({
    scrollTrigger: {
      scrub: 0.5,
      trigger: '.section--blurb' + num,
      pin: '.section--blurb' + num + ' .section__content',
      start: 'top top',
      end: 'bottom bottom'
    },
  })
    .set('.section--blurb' + num + ' .section__content .blurb p', {
      y: '+=100%',
      opacity: 0,
    })
    .to('.section--blurb' + num + ' .section__content', {
      scrollTrigger: {
        scrub: 0.5,
        trigger: '.section--blurb' + num,
        start: 'top top',
        end: 'top -=25%',
        onUpdate: self =>
          document.documentElement.style.setProperty(
            '--alpha',
            self.progress / 2
          ),
      },
    })
    .to('.section--blurb' + num + ' .section__content .blurb p', {
      y: 0,
      opacity: 1,
      scrollTrigger: {
        scrub: 0.5,
        trigger: '.section--blurb' + num,
        start: () => getPos(get_blurb_el(num), 0.2),
        end: () => getPos(get_blurb_el(num), 0.3),
      },
    })
    .fromTo(
      '.section--blurb' + num + ' .section__content .blurb p',
      {
        y: 0,
        opacity: 1,
      },
      {
        y: '-=100%',
        opacity: 0,
        scrollTrigger: {
          scrub: 0.5,
          trigger: '.section--blurb' + num,
          start: () => getPos(get_blurb_el(num), 0.4),
          end: () => getPos(get_blurb_el(num), 0.5),
        },
      }
    )
    .to(
      '.section--blurb' + num + ' .section__content',
      {
        scrollTrigger: {
          scrub: 0.5,
          trigger: '.section--blurb' + num,
          start: () => getPos(get_blurb_el(num), 0.4),
          end: () => getPos(get_blurb_el(num), 0.5),
          onUpdate: self =>
            document.documentElement.style.setProperty(
              '--alpha',
              0.5 - self.progress / 2
            ),
        },
      },
      '<'
    );


const canvas = document.getElementById("susa-dance");
const context = canvas.getContext("2d");

canvas.width = 1980 ;
canvas.height =  3520;
const frameCount = 9;
const currentFrame = index => (
  `./img/susa_dance_${index + 1}.jp2`
);

const images = []
const danceMoves = {
  frame: 0
};

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

const DANCE = () =>
  timeline({
    scrollTrigger: {
      scrub: true,
      trigger: '.section--dance',
      pin: '.section--dance .section__content',
      start: 'top top',
      end: 'bottom bottom',
    },
  })
    .to(danceMoves, {
      frame: frameCount - 1,
      snap: "frame",
      scrollTrigger: {
        scrub: true,
        trigger: '.section--dance',
        start: 'top top',
        end: 'bottom bottom'
      },
      onUpdate: render // use animation onUpdate instead of scrollTrigger's onUpdate
    });

images[0].onload = render;

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(images[danceMoves.frame], 0, 0); 
}

const SECS = (num) =>
  timeline({
    scrollTrigger: {
      scrub: 0.5,
      trigger: '.section--' + num,
      pin: '.section--' + num + ' .section__content',
      start: 'top top',
      end: 'bottom bottom',
    },
  })
    .set('.section--' + num +' .section__content .text', {
      y: '+=100%',
      opacity: 0
    })
    .set('.section--' + num +' .section__content .blurb p', {
      y: '+=100%',
      opacity: 0,
    })
    .to('.section--' + num +' .section__content', {
      scrollTrigger: {
        scrub: 0.5,
        trigger: '.section--' + num,
        start: 'top top',
        end: 'top -=25%',
        onUpdate: self =>
          document.documentElement.style.setProperty(
            '--alpha',
            self.progress / 2
          ),
      },
    })
    .to('.section--' + num +' .section__content .text', {
      y: 0,
      opacity: 1,
      stagger: 0.1,
      scrollTrigger: {
        scrub: 0.5,
        trigger: '.section--' + num,
        start: () => getPos(get_secs_el(num), 0.1),
        end: () => getPos(get_secs_el(num), 0.2),
      },
    })
    .fromTo(
      '.section--' + num +' .section__content .text',
      {
        y: 0,
        opacity: 1,
      },
      {
        y: '-=100%',
        opacity: 0,
        stagger: 0.1,
        scrollTrigger: {
          scrub: 0.5,
          trigger: '.section--' + num,
          start: () => getPos(get_secs_el(num), 0.3),
          end: () => getPos(get_secs_el(num), 0.4),
        },
      }
    )
    .to('.section--' + num +' .section__content .blurb p', {
      y: 0,
      opacity: 1,
      scrollTrigger: {
        scrub: 0.5,
        trigger: '.section--' + num,
        start: () => getPos(get_secs_el(num), 0.5),
        end: () => getPos(get_secs_el(num), 0.6),
      },
    })
    .fromTo(
      '.section--' + num +' .section__content .blurb p',
      {
        y: 0,
        opacity: 1,
      },
      {
        y: '-=100%',
        opacity: 0,
        scrollTrigger: {
          scrub: 0.5,
          trigger: '.section--' + num,
          start: () => getPos(get_secs_el(num), 0.7),
          end: () => getPos(get_secs_el(num), 0.8),
        },
      }
    )
    .to(
      '.section--' + num + ' .section__content',
      {
        scrollTrigger: {
          scrub: 0.5,
          trigger: '.section--' + num,
          start: () => getPos(get_secs_el(num), 0.7),
          end: () => getPos(get_secs_el(num), 0.8),
          onUpdate: self =>
            document.documentElement.style.setProperty(
              '--alpha',
              0.5 - self.progress / 2
            ),
        },
      },
      '<'
    );



timeline()
  .add(TITLE())
  .add(SECS(1))
  .add(DANCE())
  .add(BLURBS(1))
  .add(SECS(2))
  .add(SECS(3))
  .add(SECS(4))
  .add(SECS(5))
  .add(SECS(6))
  .add(SECS(7))
  .add(SECS(8))
  .add(SECS(9))
  .add(BLURBS(2))
  .add(BLURBS(3))
  
