const {
  gsap: { timeline, set, registerPlugin },
  ScrollTrigger,
} = window

registerPlugin(ScrollTrigger)

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
const TITLE_EL = document.querySelector('.section--title')
const INTRO_EL = document.querySelector('.section--intro')
const BLURB1_EL = document.querySelector('.section--blurb1');
const getPos = (el, pos) => {
  const BOUND = el.getBoundingClientRect()
  return BOUND.top + BOUND.height * pos
}

// const TITLE = () =>
//   timeline({
//     scrollTrigger: {
//       scrub: 0.5,
//       trigger: '.section--title',
//       pin: '.section--title .section__content',
//       start: 'top top',
//       end: 'bottom bottom'
//     },
//   })
//     .set('.section--title .section__content .blurb p', {
//       opacity: 1,
//     })
//     .to('.section--title .section__content .blurb p', {
//       scrollTrigger: {
//         scrub: 0.5,
//         trigger: '.section--title',
//         start: () => getPos(TITLE_EL, 0.1),
//         end: () => getPos(TITLE_EL, 0.2),
//       },
//     })
//     .fromTo(
//       '.section--title .section__content .blurb p',
//       {
//         y: 0,
//         opacity: 1,
//       },
//       {
//         y: '-=100%',
//         opacity: 0,
//         scrollTrigger: {
//           scrub: 0.5,
//           trigger: '.section--title',
//           start: () => getPos(TITLE_EL, 0.3),
//           end: () => getPos(TITLE_EL, 0.4),
//         },
//       }
//     )
//     .to(
//       '.section--title .section__content',
//       {
//         scrollTrigger: {
//           scrub: 0.5,
//           trigger: '.section--title',
//           start: () => getPos(TITLE_EL, 0.5),
//           end: () => getPos(TITLE_EL, 0.6),
//           onUpdate: self =>
//             document.documentElement.style.setProperty(
//               '--alpha',
//               0.5 - self.progress / 2
//             ),
//         },
//       },
//       '<'
//     );

const INTRO = () =>
  timeline({
    scrollTrigger: {
      scrub: 0.5,
      trigger: '.section--intro',
      pin: '.section--intro .section__content',
      start: 'top top',
      end: 'bottom bottom',
    },
  })
    .set('.section--intro .section__content .text', {
      y: '+=100%',
      opacity: 0
    })
    .set('.section--intro .section__content .blurb p', {
      y: '+=100%',
      opacity: 0,
    })
    .to('.section--intro .section__content', {
      scrollTrigger: {
        scrub: 0.5,
        trigger: '.section--intro',
        start: 'top top',
        end: 'top -=25%',
        onUpdate: self =>
          document.documentElement.style.setProperty(
            '--alpha',
            self.progress / 2
          ),
      },
    })
    .to('.section--intro .section__content .text', {
      y: 0,
      opacity: 1,
      stagger: 0.1,
      scrollTrigger: {
        scrub: 0.5,
        trigger: '.section--intro',
        start: () => getPos(INTRO_EL, 0.1),
        end: () => getPos(INTRO_EL, 0.2),
      },
    })
    .fromTo(
      '.section--intro .section__content .text',
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
          trigger: '.section--intro',
          start: () => getPos(INTRO_EL, 0.3),
          end: () => getPos(INTRO_EL, 0.4),
        },
      }
    )
    .to('.section--intro .section__content .blurb p', {
      y: 0,
      opacity: 1,
      scrollTrigger: {
        scrub: 0.5,
        trigger: '.section--intro',
        start: () => getPos(INTRO_EL, 0.5),
        end: () => getPos(INTRO_EL, 0.6),
      },
    })
    .fromTo(
      '.section--intro .section__content .blurb p',
      {
        y: 0,
        opacity: 1,
      },
      {
        y: '-=100%',
        opacity: 0,
        scrollTrigger: {
          scrub: 0.5,
          trigger: '.section--intro',
          start: () => getPos(INTRO_EL, 0.7),
          end: () => getPos(INTRO_EL, 0.8),
        },
      }
    )
    .to(
      '.section--intro .section__content',
      {
        scrollTrigger: {
          scrub: 0.5,
          trigger: '.section--intro',
          start: () => getPos(INTRO_EL, 0.7),
          end: () => getPos(INTRO_EL, 0.8),
          onUpdate: self =>
            document.documentElement.style.setProperty(
              '--alpha',
              0.5 - self.progress / 2
            ),
        },
      },
      '<'
    );

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

const BLURB1 = () =>
  timeline({
    scrollTrigger: {
      scrub: 0.5,
      trigger: '.section--blurb1',
      pin: '.section--blurb1 .section__content',
      start: 'top top',
      end: 'bottom bottom'
    },
  })
    .set('.section--blurb1 .section__content .blurb p', {
      y: '+=100%',
      opacity: 0,
    })
    .to('.section--blurb1 .section__content', {
      scrollTrigger: {
        scrub: 0.5,
        trigger: '.section--blurb1',
        start: 'top top',
        end: 'top -=25%',
        onUpdate: self =>
          document.documentElement.style.setProperty(
            '--alpha',
            self.progress / 2
          ),
      },
    })
    .to('.section--blurb1 .section__content .blurb p', {
      y: 0,
      opacity: 1,
      scrollTrigger: {
        scrub: 0.5,
        trigger: '.section--blurb1',
        start: () => getPos(BLURB1_EL, 0.2),
        end: () => getPos(BLURB1_EL, 0.3),
      },
    })
    .fromTo(
      '.section--blurb1 .section__content .blurb p',
      {
        y: 0,
        opacity: 1,
      },
      {
        y: '-=100%',
        opacity: 0,
        scrollTrigger: {
          scrub: 0.5,
          trigger: '.section--blurb1',
          start: () => getPos(BLURB1_EL, 0.4),
          end: () => getPos(BLURB1_EL, 0.5),
        },
      }
    )
    .to(
      '.section--blurb1 .section__content',
      {
        scrollTrigger: {
          scrub: 0.5,
          trigger: '.section--blurb1',
          start: () => getPos(BLURB1_EL, 0.4),
          end: () => getPos(BLURB1_EL, 0.5),
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
const frameCount = 8;
const currentFrame = index => (
  `img/susa_dance_${index + 1}.jp2`
);

const images = []
const airpods = {
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
    .to(airpods, {
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
  context.drawImage(images[airpods.frame], 0, 0); 
}


timeline()
  // .add(TITLE())
  .add(INTRO())
  .add(BLURB1())
  .add(DANCE())

