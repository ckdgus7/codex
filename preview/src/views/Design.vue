<template>
  <main class="design-root">
    <section class="phone" aria-label="Register screen">
      <header class="status-bar" aria-label="Status bar">
        <div class="time-wrap">
          <span class="time">9:27</span>
        </div>

        <div class="status-icons" aria-hidden="true">
          <div class="cell">
            <span class="bar bar-1" />
            <span class="bar bar-2" />
            <span class="bar bar-3" />
            <span class="bar bar-4" />
          </div>

          <div class="wifi">
            <span class="wifi-arc wifi-1" />
            <span class="wifi-arc wifi-2" />
            <span class="wifi-arc wifi-3" />
          </div>

          <div class="battery">
            <span class="battery-capacity" />
            <span class="battery-cap" />
          </div>
        </div>
      </header>

      <div class="top-row">
        <button class="back" type="button" aria-label="Back">
          <span />
        </button>
      </div>

      <h1 class="title">Register</h1>

      <form class="register-form" @submit.prevent>
        <label
          v-for="field in fields"
          :key="field.id"
          class="input-row"
          :for="field.id"
        >
          <span class="placeholder">{{ field.label }}</span>
          <input :id="field.id" :type="field.type" />
        </label>

        <button class="next" type="submit">next</button>
      </form>
    </section>
  </main>
</template>

<script setup>
const fields = [
  { id: 'email', label: 'Email address', type: 'email' },
  { id: 'password', label: 'Create password', type: 'password' },
]
</script>

<style scoped>
.design-root {
  min-height: 100vh;
  display: grid;
  place-items: start center;
  background: #ffffff;
}

.phone {
  width: 375px;
  height: 812px;
  background: #ffffff;
  position: relative;
  overflow: hidden;
}

.status-bar {
  height: 44px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 8px 14px 0 21px;
}

.time-wrap {
  width: 56px;
  height: 23px;
  display: grid;
  place-items: center;
}

.time {
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 600;
  font-size: 15px;
  line-height: 17.9px;
  letter-spacing: -0.333px;
  color: #000000;
}

.status-icons {
  margin-top: 7px;
  width: 68px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cell {
  width: 18px;
  height: 12px;
  display: flex;
  align-items: flex-end;
  gap: 2px;
}

.bar {
  width: 3px;
  background: #dadada;
  border-radius: 0.5px;
}

.bar-1 {
  height: 4px;
}

.bar-2 {
  height: 6px;
}

.bar-3 {
  height: 8px;
}

.bar-4 {
  height: 10.67px;
}

.wifi {
  width: 21px;
  height: 15px;
  position: relative;
}

.wifi-arc {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border: 2px solid #dadada;
  border-bottom: 0;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.wifi-1 {
  top: 0;
  width: 15px;
  height: 8px;
}

.wifi-2 {
  top: 4px;
  width: 10px;
  height: 6px;
}

.wifi-3 {
  top: 8px;
  width: 5px;
  height: 4px;
}

.battery {
  width: 25px;
  height: 12px;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.35);
  border-radius: 2.67px;
  box-sizing: border-box;
}

.battery-capacity {
  position: absolute;
  left: 2px;
  top: 2px;
  width: 18px;
  height: 7.33px;
  border-radius: 1.33px;
  background: #000000;
}

.battery-cap {
  position: absolute;
  right: -2px;
  top: 3px;
  width: 1.33px;
  height: 4px;
  border-radius: 0.66px;
  background: rgba(0, 0, 0, 0.4);
}

.top-row {
  margin-top: 16px;
  padding-left: 16px;
}

.back {
  width: 12.21px;
  height: 11.35px;
  border: 0;
  padding: 0;
  background: transparent;
  display: grid;
  place-items: center;
  cursor: default;
}

.back span {
  width: 7.8px;
  height: 7.8px;
  border-left: 2px solid rgba(0, 0, 0, 0.8);
  border-bottom: 2px solid rgba(0, 0, 0, 0.8);
  transform: rotate(45deg);
}

.title {
  margin: 32px 0 0 16px;
  font-family: 'Comfortaa', 'Trebuchet MS', 'Segoe UI', sans-serif;
  font-weight: 400;
  font-size: 36px;
  line-height: 40.14px;
  letter-spacing: -0.54px;
  color: #000000;
}

.register-form {
  margin-top: 32px;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-row {
  position: relative;
  display: block;
  width: 343px;
  height: 52px;
  border: 2px solid #000000;
  box-sizing: border-box;
  background: #ffffff;
}

.placeholder {
  position: absolute;
  left: 17px;
  top: 17px;
  font-family: 'Roboto', 'Segoe UI', sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 17.58px;
  color: rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

.input-row input {
  width: 100%;
  height: 100%;
  border: 0;
  background: transparent;
  padding: 16px 16px 16px 17px;
  box-sizing: border-box;
  font-family: 'Roboto', 'Segoe UI', sans-serif;
  font-size: 15px;
  line-height: 17.58px;
  color: #000000;
}

.input-row input:focus {
  outline: none;
}

.input-row input::placeholder {
  color: transparent;
}

.next {
  width: 343px;
  height: 52px;
  border: 2px solid #000000;
  border-radius: 6px;
  background: #000000;
  color: #ffffff;
  font-family: 'Roboto', 'Segoe UI', sans-serif;
  font-style: normal;
  font-weight: 900;
  font-size: 13px;
  line-height: 15.23px;
  letter-spacing: 0.52px;
  text-transform: uppercase;
}
</style>
