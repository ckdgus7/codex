<template>
  <main class="page">
    <section class="phone-frame" aria-label="Profile screen">
      <header class="status-bar" aria-label="Status bar">
        <div class="status-time">9:27</div>
        <div class="status-icons" aria-hidden="true">
          <div class="cell-icon">
            <span></span><span></span><span></span><span></span>
          </div>
          <div class="wifi-icon">
            <span></span><span></span><span></span>
          </div>
          <div class="battery-icon">
            <div class="battery-border">
              <div class="battery-capacity"></div>
            </div>
            <div class="battery-cap"></div>
          </div>
        </div>
      </header>

      <section class="profile-content">
        <img class="avatar" :src="avatarSrc" alt="Jane profile" />

        <h1 class="name">Jane</h1>
        <p class="location">SAN FRANCISCO, CA</p>

        <button class="btn btn-dark" type="button">FOLLOW JANE</button>
        <button class="btn btn-light" type="button">MESSAGE</button>

        <section class="gallery" aria-label="Photo gallery">
          <div class="col">
            <img
              v-for="item in leftColumn"
              :key="item.id"
              class="gallery-img"
              :class="item.className"
              :src="item.src"
              alt=""
            />
          </div>
          <div class="col">
            <img
              v-for="item in rightColumn"
              :key="item.id"
              class="gallery-img"
              :class="item.className"
              :src="item.src"
              alt=""
            />
          </div>
        </section>

        <button class="btn btn-light see-more" type="button">SEE MORE</button>
      </section>

      <nav class="tab-bar" aria-label="Bottom navigation">
        <div class="tab-bg"></div>
        <button class="tab" type="button" aria-label="Home">
          <span class="home-icon" aria-hidden="true"></span>
        </button>
        <button class="tab" type="button" aria-label="Search">
          <span class="search-icon" aria-hidden="true"></span>
        </button>
        <button class="tab upload" type="button" aria-label="Upload">
          <span class="plus-icon" aria-hidden="true"></span>
        </button>
        <button class="tab" type="button" aria-label="Chat">
          <span class="chat-icon" aria-hidden="true"></span>
        </button>
        <button class="tab" type="button" aria-label="Profile">
          <span class="profile-icon" aria-hidden="true"></span>
        </button>
        <div class="home-indicator" aria-hidden="true"></div>
      </nav>
    </section>
  </main>
</template>

<script setup>
const avatarSrc =
  'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/85c6e252-e3cb-4c63-9877-48e57d724c55'

const leftColumn = [
  {
    id: '0:500',
    src: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/01d32c60-b25c-4e2c-8931-8119e922cfea',
    className: 'h220'
  },
  {
    id: '0:505',
    src: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ea91ded6-e45c-4788-bddb-4fcc608da0b8',
    className: 'h310'
  },
  {
    id: '0:504',
    src: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/5c0256ad-87f1-4adc-8346-73f8a623bb3b',
    className: 'h310'
  }
]

const rightColumn = [
  {
    id: '0:502',
    src: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/c78045c0-a26a-49c7-887f-e0d2bb6b6ff1',
    className: 'h310'
  },
  {
    id: '0:503',
    src: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/7f52d419-64bb-4543-86b4-bacae4e91c08',
    className: 'h310'
  },
  {
    id: '0:501',
    src: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/9e4c022a-afdc-43a9-b435-48825661441f',
    className: 'h220'
  }
]
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #ffffff;
}

.phone-frame {
  width: 375px;
  height: 812px;
  background: #fff;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  color: #000;
}

.status-bar {
  height: 44px;
  padding: 14px 14px 0 21px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  box-sizing: border-box;
}

.status-time {
  font-family: 'SF Pro Text', 'Segoe UI', sans-serif;
  font-size: 15px;
  font-weight: 600;
  line-height: 17.9px;
  letter-spacing: -0.333px;
}

.status-icons {
  width: 68px;
  height: 16px;
  margin-top: 1px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cell-icon {
  width: 18px;
  height: 12px;
  display: flex;
  align-items: flex-end;
  gap: 1px;
}

.cell-icon span {
  width: 3px;
  background: #d9d9d9;
  border-radius: 1px;
}

.cell-icon span:nth-child(1) { height: 4px; }
.cell-icon span:nth-child(2) { height: 6px; }
.cell-icon span:nth-child(3) { height: 8px; }
.cell-icon span:nth-child(4) { height: 10px; }

.wifi-icon {
  width: 15px;
  height: 11px;
  position: relative;
}

.wifi-icon span {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border: 2px solid #d9d9d9;
  border-color: #d9d9d9 transparent transparent transparent;
  border-radius: 50%;
}

.wifi-icon span:nth-child(1) {
  width: 15px;
  height: 12px;
  top: -3px;
}

.wifi-icon span:nth-child(2) {
  width: 10px;
  height: 8px;
  top: 0;
}

.wifi-icon span:nth-child(3) {
  width: 5px;
  height: 4px;
  top: 4px;
}

.battery-icon {
  width: 25px;
  height: 12px;
  display: flex;
  align-items: center;
  gap: 1px;
}

.battery-border {
  width: 22px;
  height: 11px;
  border: 1px solid rgba(0, 0, 0, 0.35);
  border-radius: 2.67px;
  padding: 2px;
  box-sizing: border-box;
}

.battery-capacity {
  width: 100%;
  height: 100%;
  background: #000;
  border-radius: 1.33px;
}

.battery-cap {
  width: 1.33px;
  height: 4px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 1px;
}

.profile-content {
  padding: 32px 16px 32px;
}

.avatar {
  display: block;
  width: 128px;
  height: 128px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto;
}

.name {
  margin: 32px 0 0;
  text-align: center;
  font-family: 'Comfortaa', cursive;
  font-size: 36px;
  font-weight: 400;
  line-height: 40.14px;
  letter-spacing: -0.54px;
}

.location {
  margin: 16px 0 0;
  text-align: center;
  font-family: 'Roboto', 'Segoe UI', sans-serif;
  font-size: 13px;
  font-weight: 900;
  line-height: 15.23px;
  letter-spacing: 0.52px;
}

.btn {
  width: 343px;
  height: 52px;
  border-radius: 6px;
  border: 2px solid #000;
  font-family: 'Roboto', 'Segoe UI', sans-serif;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.52px;
  text-transform: uppercase;
  cursor: pointer;
}

.btn-dark {
  margin-top: 32px;
  background: #000;
  color: #fff;
}

.btn-light {
  margin-top: 16px;
  background: #fff;
  color: #000;
}

.gallery {
  margin-top: 32px;
  display: grid;
  grid-template-columns: repeat(2, 167px);
  gap: 9px;
}

.col {
  display: grid;
  gap: 10px;
  align-content: start;
}

.gallery-img {
  width: 167px;
  object-fit: cover;
  display: block;
}

.h220 { height: 220px; }
.h310 { height: 310px; }

.see-more {
  margin-top: 32px;
  margin-bottom: 96px;
}

.tab-bar {
  width: 375px;
  height: 83px;
  position: sticky;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 9px 11px 0;
  box-sizing: border-box;
}

.tab-bg {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(27px);
  box-shadow: 0 -0.5px 0 rgba(0, 0, 0, 0.3);
  z-index: 0;
}

.tab {
  width: 40px;
  height: 40px;
  border: 0;
  background: transparent;
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  padding: 0;
}

.upload {
  width: 70px;
  border-radius: 20px;
  background: linear-gradient(90deg, #ff00d6 0%, #ff4d00 100%);
}

.home-icon {
  width: 15px;
  height: 14px;
  border: 2px solid rgba(0, 0, 0, 0.8);
  border-top: 0;
  border-radius: 2px;
  position: relative;
}

.home-icon::before {
  content: '';
  position: absolute;
  top: -7px;
  left: 1px;
  width: 9px;
  height: 9px;
  border-left: 2px solid rgba(0, 0, 0, 0.8);
  border-top: 2px solid rgba(0, 0, 0, 0.8);
  transform: rotate(45deg);
}

.search-icon {
  width: 13px;
  height: 13px;
  border: 2px solid rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  position: relative;
}

.search-icon::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 2px;
  background: rgba(0, 0, 0, 0.8);
  right: -5px;
  bottom: -1px;
  transform: rotate(45deg);
  transform-origin: center;
}

.plus-icon,
.plus-icon::before {
  width: 13px;
  height: 1px;
  background: #fff;
  display: block;
  content: '';
  position: absolute;
}

.plus-icon {
  position: relative;
}

.plus-icon::before {
  transform: rotate(90deg);
}

.chat-icon {
  width: 16px;
  height: 14px;
  border-radius: 8px;
  background: #d9d9d9;
  position: relative;
}

.chat-icon::after {
  content: '';
  position: absolute;
  left: -2px;
  bottom: 1px;
  width: 6px;
  height: 6px;
  background: #d9d9d9;
  clip-path: polygon(100% 0, 0 50%, 100% 100%);
}

.profile-icon {
  width: 11px;
  height: 6px;
  border: 1px solid rgba(0, 0, 0, 0.8);
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  border-bottom: 0;
  position: relative;
  margin-top: 6px;
}

.profile-icon::before {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border: 1px solid rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  left: 50%;
  top: -10px;
  transform: translateX(-50%);
}

.home-indicator {
  position: absolute;
  width: 135px;
  height: 5px;
  background: #000;
  border-radius: 10px;
  left: 120px;
  bottom: 8px;
  z-index: 1;
}
</style>
