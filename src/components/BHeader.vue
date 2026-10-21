<template>
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills justify-content-center">
        <li class="nav-item">
          <RouterLink
            to="/"
            class="nav-link"
            active-class="active"
          >
            Home (Week 5)
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink
            to="/about"
            class="nav-link"
            active-class="active"
          >
            About
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink
            to="/firebase-register"
            class="nav-link"
            active-class="active"
          >
            Register (Week 7)
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink
            to="/firebase-signin"
            class="nav-link"
            active-class="active"
          >
            Sign in (Week 7)
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink
            to="/WeatherCheck"
            class="nav-link"
            active-class="active"
          >
            Get Weather
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink
            to="/getbookcount"
            class="nav-link"
            active-class="active"
          >
            Get Book Count
          </RouterLink>
        </li>

         <li class="nav-item">
          <RouterLink
            to="/GetAllBookAPI"
            class="nav-link"
            active-class="active"
          >
            Get All BookAPI
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink
            to="/firebase-logout"
            class="nav-link"
            active-class="active"
          >
            Log out (Week 7)
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink
            to="/addbook"
            class="nav-link"
            active-class="active"
          >
            Add Book (Week 8)
          </RouterLink>
        </li>
      </ul>
    </header>
  </div>
</template>
