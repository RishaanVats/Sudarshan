import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap } from 'rxjs/operators';
import { fetchWeatherApi } from 'openmeteo';

import { GeoCodingResult, GeoCodingResponse } from '../../core/types';

@Component({
  selector: 'app-weather-planner',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './weather-planner.html',
  styleUrls: ['./weather-planner.css'],
})
export class WeatherPlanner {
  private http = inject(HttpClient);

  searchControl = new FormControl('');

  loadingMessage = "The ground report is loading…";
  apiErrorMessage = "The weather department has gone off the record. \r\nWe couldn't fetch the latest forecast. Please try again later.";
  // State Management Variables
  options: GeoCodingResult[] = [];
  selectedCity: GeoCodingResult | null = null;
  isLoading = false;
  apiError = true;
  errorMessage: string | null = '';
  showDropdown = false;

  weatherData = signal([]);
  weatherType: 'sunny' | 'cloudy' | 'rainy' | 'foggy' | 'snowy' | 'windy' | null = null;
  sunny = true;
  cloudy = false;
  rainy = false;
  foggy = false;
  snowy = false;
  windy = false;

  // TRACK KEYBOARD NAVIGATION INDEX
  activeRowIndex = -1;

  private searchSubscription!: Subscription;

  ngOnInit(): void {
    this.searchSubscription = this.searchControl.valueChanges
      .pipe(
        // Wait for 300ms after the user stops typing before making the API call
        debounceTime(300),
        // Only trigger if the search Term changes
        distinctUntilChanged(),
        // Intercept and process values from the search input
        switchMap((value) => {
          const searchTerm = (value || '').trim();

          // Enforce the 2-charecter threshold condition before the API is hit
          if (searchTerm.length < 2) {
            this.options = [];
            this.showDropdown = false;
            return of(null); // Return an observable of null to terminate the stream
          }
          this.showDropdown = true; // Show the dropdown when the search term is valid
          this.isLoading = true;
          this.errorMessage = '';

          const geoCodingURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchTerm)}&count=5&language=en&format=json&countryCode=IN`;

          return this.http.get<GeoCodingResponse>(geoCodingURL).pipe(
            catchError((error) => {
              this.errorMessage = 'Failed to fetch location data. Please try again later.';
              return of(null); 
            }),
          );
        }),
      )
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response && response.results) {
            this.options = response.results;
          } else {
            this.options = [];
          }
          this.activeRowIndex = -1; // Reset the active row index whenever new options are loaded
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        },
      });
  }

  // HANDLE KEYBOARD EVENT LOGIC
  onKeyDown(event: KeyboardEvent): void {
    if (this.options.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      // Move down the list, loop back to top if at end
      this.activeRowIndex = (this.activeRowIndex + 1) % this.options.length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      // Move up the list, loop to bottom if at top
      this.activeRowIndex = (this.activeRowIndex - 1 + this.options.length) % this.options.length;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      // Select item if index is valid
      if (this.activeRowIndex >= 0 && this.activeRowIndex < this.options.length) {
        this.selectOption(this.options[this.activeRowIndex]);
      }
    } else if (event.key === 'Escape') {
      this.options = [];
      this.showDropdown = false; // Hide the dropdown when Escape is pressed
      this.activeRowIndex = -1;
    }
  }

  // Handles dropdown list selection
  selectOption(city: GeoCodingResult) {
    this.selectedCity = city;
    // Set the input text box to the chosen name
    this.searchControl.setValue(city.name, { emitEvent: false });
    // Clear the dropdown list after selection
    this.options = [];
    this.showDropdown = false; // Hide the dropdown after selection
    this.activeRowIndex = -1; // Reset the active row index after selection
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  clearSearch(): void {
    this.searchControl.setValue(''); // Wipe out text input
    this.options = []; // Clear suggestions dropdown
    // this.selectedCity = null; // Clear the selected target object
    this.showDropdown = false; // Hide the dropdown
    this.activeRowIndex = -1; // Reset keyboard focus indicator
  }

  async getLocationDetails(city: string) {
    // First, we need to fetch the geocoding data to get the coordinates for the location
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=5&language=en&format=json`;
    const geocodingResponse = await fetch(geocodingUrl);
    const geocodingData = await geocodingResponse.json();

    // Use the first result's coordinates
    const { latitudeFetched, longitudeFetched } = geocodingData.results[0];
    console.log(`Fetched Coordinates: ${latitudeFetched}°N ${longitudeFetched}°E`);
    // Update the params with the fetched coordinates
    // params.latitude = latitudeFetched;
    // params.longitude = longitudeFetched;
  }
  // async ngOnInit() {
  //   const params = {
  //     latitude: 0,
  //     longitude: 0,
  //     daily: [
  //       'sunrise',
  //       'sunset',
  //       'daylight_duration',
  //       'sunshine_duration',
  //       'temperature_2m_max',
  //       'temperature_2m_min',
  //       'apparent_temperature_max',
  //       'apparent_temperature_min',
  //       'rain_sum',
  //       'precipitation_hours',
  //     ],
  //     hourly: [
  //       'temperature_2m',
  //       'apparent_temperature',
  //       'precipitation_probability',
  //       'rain',
  //       'snowfall',
  //       'weather_code',
  //       'cloud_cover',
  //       'visibility',
  //       'temperature_80m',
  //       'wind_speed_80m',
  //       'wind_direction_80m',
  //     ],
  //     current: [
  //       'temperature_2m',
  //       'relative_humidity_2m',
  //       'is_day',
  //       'precipitation',
  //       'rain',
  //       'snowfall',
  //       'showers',
  //       'weather_code',
  //       'cloud_cover',
  //       'wind_direction_10m',
  //       'wind_speed_10m',
  //       'apparent_temperature',
  //     ],
  //     timezone: 'auto',
  //   };

  //   const url = 'https://api.open-meteo.com/v1/forecast';
  //   const responses = await fetchWeatherApi(url, params);

  //   // Process first location. Add a for-loop for multiple locations or weather models
  //   const response = responses[0];

  //   // Attributes for timezone and location
  //   const latitude = response.latitude();
  //   const longitude = response.longitude();
  //   console.log(`Received Response: ${JSON.stringify(response)}`);
  //   const elevation = response.elevation();
  //   const timezone = response.timezone();
  //   const timezoneAbbreviation = response.timezoneAbbreviation();
  //   const utcOffsetSeconds = response.utcOffsetSeconds();

  //   console.log(
  //     `\nCoordinates: ${latitude}°N ${longitude}°E`,
  //     `\nElevation: ${elevation}m asl`,
  //     `\nTimezone: ${timezone} ${timezoneAbbreviation}`,
  //     `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`,
  //   );

  //   const current = response.current()!;
  //   const hourly = response.hourly()!;
  //   const daily = response.daily()!;

  //   // Define Int64 variables so they can be processed accordingly
  //   const sunrise = daily.variables(0)!;
  //   const sunset = daily.variables(1)!;

  //   // Note: The order of weather variables in the URL query and the indices below need to match!
  //   const weatherData = {
  //     current: {
  //       time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
  //       temperature_2m: current.variables(0)!.value(),
  //       relative_humidity_2m: current.variables(1)!.value(),
  //       is_day: current.variables(2)!.value(),
  //       precipitation: current.variables(3)!.value(),
  //       rain: current.variables(4)!.value(),
  //       snowfall: current.variables(5)!.value(),
  //       showers: current.variables(6)!.value(),
  //       weather_code: current.variables(7)!.value(),
  //       cloud_cover: current.variables(8)!.value(),
  //       wind_direction_10m: current.variables(9)!.value(),
  //       wind_speed_10m: current.variables(10)!.value(),
  //       apparent_temperature: current.variables(11)!.value(),
  //     },
  //     hourly: {
  //       time: Array.from(
  //         { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() },
  //         (_, i) =>
  //           new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000),
  //       ),
  //       temperature_2m: hourly.variables(0)!.valuesArray(),
  //       apparent_temperature: hourly.variables(1)!.valuesArray(),
  //       precipitation_probability: hourly.variables(2)!.valuesArray(),
  //       rain: hourly.variables(3)!.valuesArray(),
  //       snowfall: hourly.variables(4)!.valuesArray(),
  //       weather_code: hourly.variables(5)!.valuesArray(),
  //       cloud_cover: hourly.variables(6)!.valuesArray(),
  //       visibility: hourly.variables(7)!.valuesArray(),
  //       temperature_80m: hourly.variables(8)!.valuesArray(),
  //       wind_speed_80m: hourly.variables(9)!.valuesArray(),
  //       wind_direction_80m: hourly.variables(10)!.valuesArray(),
  //     },
  //     daily: {
  //       time: Array.from(
  //         { length: (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval() },
  //         (_, i) =>
  //           new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000),
  //       ),
  //       // Map Int64 values to according structure
  //       sunrise: [...Array(sunrise.valuesInt64Length())].map(
  //         (_, i) => new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000),
  //       ),
  //       // Map Int64 values to according structure
  //       sunset: [...Array(sunset.valuesInt64Length())].map(
  //         (_, i) => new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000),
  //       ),
  //       daylight_duration: daily.variables(2)!.valuesArray(),
  //       sunshine_duration: daily.variables(3)!.valuesArray(),
  //       temperature_2m_max: daily.variables(4)!.valuesArray(),
  //       temperature_2m_min: daily.variables(5)!.valuesArray(),
  //       apparent_temperature_max: daily.variables(6)!.valuesArray(),
  //       apparent_temperature_min: daily.variables(7)!.valuesArray(),
  //       rain_sum: daily.variables(8)!.valuesArray(),
  //       precipitation_hours: daily.variables(9)!.valuesArray(),
  //     },
  //   };

  //   // The 'weatherData' object now contains a simple structure, with arrays of datetimes and weather information
  //   console.log(
  //     `\nCurrent time: ${weatherData.current.time}\n`,
  //     `\nCurrent temperature_2m: ${weatherData.current.temperature_2m}`,
  //     `\nCurrent relative_humidity_2m: ${weatherData.current.relative_humidity_2m}`,
  //     `\nCurrent is_day: ${weatherData.current.is_day}`,
  //     `\nCurrent precipitation: ${weatherData.current.precipitation}`,
  //     `\nCurrent rain: ${weatherData.current.rain}`,
  //     `\nCurrent snowfall: ${weatherData.current.snowfall}`,
  //     `\nCurrent showers: ${weatherData.current.showers}`,
  //     `\nCurrent weather_code: ${weatherData.current.weather_code}`,
  //     `\nCurrent cloud_cover: ${weatherData.current.cloud_cover}`,
  //     `\nCurrent wind_direction_10m: ${weatherData.current.wind_direction_10m}`,
  //     `\nCurrent wind_speed_10m: ${weatherData.current.wind_speed_10m}`,
  //     `\nCurrent apparent_temperature: ${weatherData.current.apparent_temperature}`,
  //   );
  //   console.log('\nHourly data:\n', weatherData.hourly);
  //   console.log('\nDaily data:\n', weatherData.daily);
  // }
}

