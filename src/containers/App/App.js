import React, { Component } from 'react';

import CustomScrollbars from '../../components/CustomScrollbars/CustomScrollbars';
import BackgroundWrapper from '../../components/BackgroundWrapper/BackgroundWrapper';
import Nav from '../../components/Nav/Nav';
import Landing from '../../components/Landing/Landing';
import Budget from '../../components/Budget/Budget';
import SavedBudgets from '../../components/SavedBudgets/SavedBudgets';
import Profile from '../../components/Profile/Profile';
import About from '../../components/About/About';
import Message from '../../components/Message/Message';
import PreloadedBackgrounds from '../../components/PreloadedBackgrounds/PreloadedBackgrounds';

import cloneDeep from 'lodash/cloneDeep';
import { CSSTransition } from 'react-transition-group';

import pathBg1 from '../../images/bg1.webp';
import pathBg2 from '../../images/bg2.webp';
import pathBg3 from '../../images/bg3.webp';
import pathBg4 from '../../images/bg4.webp';
import pathBg5 from '../../images/bg5.webp';
import pathBg6 from '../../images/bg6.webp';
import pathBg7 from '../../images/bg7.webp';
import pathBg8 from '../../images/bg8.webp';

import './App.scss';

// Valid routes
// 'signin', 'signup', 'budget', 'saved-budgets', 'profile', 'about'

// Valid landing message codes:
// 'fields-empty', 'password-length-invalid', 'credentials-invalid'
// 'username-empty', 'password-empty'

// Set initial state to be passed into App state.
const initialState = {
  route: 'signup',
  message: { code: null, show: false },
  landingMessageCode: null,
  input: {
    displayName: { value: '', empty: false },
    username: { value: '', empty: false },
    password: { value: '', empty: false, minLength: 6, maxLength: 60 },
    entryCategory: '',
    projectedMonthlyIncome: '',
    actualMonthlyIncome: '',
  },
  user: {
    id: null,
    isLoggedIn: false,
    isGuest: true,
    displayName: 'Guest',
    username: null,
    joined: null,
    maxBudgets: 100,
    currentBudgetIndex: 0,
    clickedDeleteBudget: false,
    budgets: [
      {
        id: 0,
        name: `${new Date().toLocaleString('default', {
          month: 'long',
        })} ${new Date().getFullYear()}`,
        projectedMonthlyIncome: 0,
        actualMonthlyIncome: 0,
        getProjectedBalance() {
          return this.projectedMonthlyIncome - this.getProjectedCost();
        },
        getActualBalance() {
          return this.actualMonthlyIncome - this.getActualCost();
        },
        getDifferenceBalance() {
          return this.getActualBalance() - this.getProjectedBalance();
        },
        getProjectedCost() {
          if (this.entries.length === 0) return 0;
          else {
            const projectedCosts = this.entries.map(
              (entry) => entry.projectedCost
            );
            return projectedCosts.reduce((acc, value) => acc + value);
          }
        },
        getActualCost() {
          if (this.entries.length === 0) return 0;
          else {
            const actualCosts = this.entries.map((entry) => entry.actualCost);
            return actualCosts.reduce((acc, value) => acc + value);
          }
        },
        getDifferenceCost() {
          return this.getProjectedCost() - this.getActualCost();
        },
        entries: [
          {
            id: 0,
            category: 'Housing costs',
            projectedCost: 1000,
            actualCost: 1100,
            getDifference() {
              return this.projectedCost - this.actualCost;
            },
          },
          {
            id: 1,
            category: 'Vehicle expenses',
            projectedCost: 200,
            actualCost: 175,
            getDifference() {
              return this.projectedCost - this.actualCost;
            },
          },
          {
            id: 2,
            category: 'Phone bill',
            projectedCost: 20,
            actualCost: 20,
            getDifference() {
              return this.projectedCost - this.actualCost;
            },
          },
        ],
      },
    ],
  },
};

const backgrounds = [
  { name: 'BANFF', path: pathBg1, useDarkLanding: true, initial: true },
  { name: 'MACHU PICCHU', path: pathBg2, useDarkLanding: true, initial: true },
  {
    name: 'ALPINE MOUNTAINS',
    path: pathBg3,
    useDarkLanding: false,
    initial: true,
  },
  {
    name: 'YOSEMITE VALLEY',
    path: pathBg4,
    useDarkLanding: true,
    initial: true,
  },
  {
    name: 'GRAND CANYON',
    path: pathBg6,
    useDarkLanding: false,
    initial: false,
  },
  { name: 'TRAIL', path: pathBg7, useDarkLanding: false, initial: false },
  { name: 'MITTENWALD', path: pathBg5, useDarkLanding: false, initial: false },
  { name: 'SILHOUETTE', path: pathBg8, useDarkLanding: false, initial: false },
];

// Intl.NumberFormat object is a constructor that enables language sensitive
// number formatting.
// Takes parameters ([locales[, options]]).
const formatterUnitedStatesDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/**
 *
 * @param {object} budget The budget to be formatted (values should be numbers).
 * @param {object} formatter The formatter instantiated with the Intl.NumberFormat() constructor.
 * @returns Formatted budget.
 */
const formatCurrency = (budget, formatter) => {
  return {
    projectedMonthlyIncome: formatter.format(budget.projectedMonthlyIncome),
    actualMonthlyIncome: formatter.format(budget.actualMonthlyIncome),
    projectedBalance: formatter.format(budget.getProjectedBalance()),
    actualBalance: formatter.format(budget.getActualBalance()),
    differenceBalance: formatter.format(budget.getDifferenceBalance()),
    projectedCost: formatter.format(budget.getProjectedCost()),
    actualCost: formatter.format(budget.getActualCost()),
    differenceCost: formatter.format(budget.getDifferenceCost()),
  };
};

// Format negative numbers as numbers enclosed in parentheses.
const formatNegativeValues = (formattedBudget) => {
  const entries = Object.entries(formattedBudget);

  const formattedNegativeValues = entries.map((entry) =>
    entry[1].startsWith('-')
      ? [entry[0], entry[1].replace('-', '(').concat(')')]
      : entry
  );

  return Object.fromEntries(formattedNegativeValues);
};

// formatBudget formats negative values in pre-formatted budget.
const formatBudget = (budget, formatter) => {
  return formatNegativeValues(formatCurrency(budget, formatter));
};

/**
 *
 * @param {object} entries The entries to be formatted.
 * @param {*} formatter The formatter instantiated with the Intl.NumberFormat() constructor.
 * @returns Formatted entries.
 */
const formatEntries = (entries, formatter) => {
  if (!entries?.length) return [];
  return entries.map((entry) => {
    return {
      id: entry.id,
      category: entry.category,
      projectedCost: formatter.format(entry.projectedCost),
      actualCost: formatter.format(entry.actualCost),
      difference: formatter.format(entry.getDifference()),
    };
  });
};

const someFieldsEmpty = (fields) => {
  return fields.some((field) => field === '');
};

const allFieldsEmpty = (fields) => {
  return fields.every((field) => field === '');
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
    this.state.background = backgrounds[0];
  }

  componentDidMount() {
    this.setBackgroundFromLocalStorage();
  }

  /**
   *
   * @param {number} milliseconds Number of milliseconds to clear message after.
   */
  clearMessage = (milliseconds = 4000) => {
    if (this.messageTimeout) clearTimeout(this.messageTimeout);

    this.messageTimeout = setTimeout(() => {
      const message = { ...this.state.message, show: false };
      this.setState({ message });
    }, milliseconds);
  };

  // Sets background from localStorage if it exists there,
  // otherwise set a random background.
  setBackgroundFromLocalStorage() {
    const localStorageBackgroundName = localStorage.getItem('background');
    if (localStorageBackgroundName) {
      const backgroundArray = backgrounds.filter(
        (background) => background.name === localStorageBackgroundName
      );

      if (backgroundArray.length === 0)
        backgroundArray[0] = this.state.background;

      const state = { ...this.state, background: backgroundArray[0] };
      this.setState(state);
      return;
    }

    const initialBackgrounds = backgrounds.filter(
      (background) => background.initial
    );
    const randomInitialBackgroundIndex = Math.floor(
      Math.random() * initialBackgrounds.length
    );
    const randomBackgroundName =
      initialBackgrounds[randomInitialBackgroundIndex].name;

    const backgroundArray = backgrounds.filter(
      (background) => background.name === randomBackgroundName
    );

    const state = { ...this.state, background: backgroundArray[0] };
    this.setState(state);
  }

  handleRouteChange = (route) => {
    // Create a budget if user routes to Budget with no saved-budgets.
    if (route === 'budget' && this.state.user.budgets.length === 0) {
      this.handleAddBudget();
      this.setState({ route: 'budget' });
    }
    // Handle user sign in.
    else if (
      route !== this.state.route &&
      route !== 'signup' &&
      route !== 'signin' &&
      !this.state.user.isLoggedIn &&
      !this.state.user.isGuest
    ) {
      localStorage.setItem('background', this.state.background.name);

      const user = { ...this.state.user, isLoggedIn: true, joined: new Date() };
      const message = {
        ...this.state.message,
        code: 'user-logged-in',
        show: true,
      };
      this.setState({
        user,
        route,
        message,
        input: initialState.input,
        landingMessageCode: null,
      });
      this.clearMessage(6000);
    }
    // Handle guest sign in (don't set background in localStorage).
    else if (
      route !== this.state.route &&
      route !== 'signup' &&
      route !== 'signin' &&
      !this.state.user.isLoggedIn &&
      this.state.user.isGuest
    ) {
      const user = { ...this.state.user, isLoggedIn: true, joined: new Date() };
      const message = {
        ...this.state.message,
        code: 'user-logged-in',
        show: true,
      };
      this.setState({
        user,
        route,
        message,
        input: initialState.input,
        landingMessageCode: null,
      });
      this.clearMessage(6000);
    }
    // Handle user/guest sign out.
    else if (
      route !== this.state.route &&
      (route === 'signup' || route === 'signin') &&
      this.state.user.isLoggedIn
    ) {
      const message = { ...this.state.message, show: false };
      this.setState({
        route,
        message,
        input: initialState.input,
        user: initialState.user,
      });
    }
    // Reset input and message code when routing between
    // SignIn and SignUp components.
    else if (
      (route === 'signin' || route === 'signup') &&
      (this.state.route === 'signin' || this.state.route === 'signup')
    )
      this.setState({
        input: initialState.input,
        landingMessageCode: null,
        route,
      });
    else if (route !== this.state.route) this.setState({ route });
  };

  // Only filter through backgrounds if selected background is different
  // from current background.
  handleBackgroundChange = (event) => {
    if (this.state.background.name !== event.target.textContent) {
      localStorage.setItem('background', event.target.textContent);

      const selectedBackground = backgrounds.filter(
        (background) => background.name === event.target.textContent
      );
      this.setState({ background: selectedBackground[0] });
    } else if (localStorage.getItem('background') !== event.target.textContent)
      localStorage.setItem('background', event.target.textContent);
  };

  // Update state entry category input with user input.
  handleEntryCategoryInputChange = (event) => {
    const input = { ...this.state.input, entryCategory: event.target.value };
    this.setState({ input });
  };

  // Create entry object.
  // If input entry category is empty, set to 'No category set'.
  getNewEntry = () => {
    const category = this.state.input.entryCategory || 'No category set';

    return {
      id:
        this.state.user.budgets[this.state.user.currentBudgetIndex].entries[
          this.state.user.budgets[this.state.user.currentBudgetIndex].entries
            .length - 1
        ]?.id + 1 || 0,
      category,
      projectedCost: 0,
      actualCost: 0,
      getDifference() {
        return this.projectedCost - this.actualCost;
      },
    };
  };

  // Event handler for add entry button.
  // Add entry, then reset the category input field.
  handleAddEntry = () => {
    const userCopy = cloneDeep(this.state.user);

    userCopy.budgets[this.state.user.currentBudgetIndex].entries.push(
      this.getNewEntry()
    );
    this.setState({ user: userCopy });

    const input = { ...this.state.input, entryCategory: '' };
    this.setState({ input });
  };

  // Event handler for delete entry button.
  handleDeleteEntry = (index) => {
    const userCopy = cloneDeep(this.state.user);
    const entries =
      userCopy.budgets[this.state.user.currentBudgetIndex].entries;
    const filteredEntries = entries.filter((entry) => entry.id !== index);
    userCopy.budgets[this.state.user.currentBudgetIndex].entries =
      filteredEntries;
    this.setState({ user: userCopy });
  };

  // Event handler for initial delete button.
  // Changes delete button to confirm delete button.
  handleUserClickedDeleteBudget = (userClicked) => {
    const userCopy = cloneDeep(this.state.user);
    if (userClicked) {
      userCopy.clickedDeleteBudget = true;
      this.setState({ user: userCopy });
    } else {
      userCopy.clickedDeleteBudget = false;
      this.setState({ user: userCopy });
    }
  };

  // Event handler for confirm delete button.
  handleDeleteBudget = () => {
    const filteredBudgets = this.state.user.budgets.filter(
      (budget, i) => i !== this.state.user.currentBudgetIndex
    );

    const user = Object.assign(cloneDeep(this.state.user), {
      budgets: filteredBudgets,
      currentBudgetIndex:
        this.state.user.currentBudgetIndex >= 1
          ? this.state.user.currentBudgetIndex - 1
          : 0,
      clickedDeleteBudget: false,
    });

    const message = {
      ...this.state.message,
      code: 'budget-deleted',
      show: true,
    };
    this.setState({
      user,
      route: 'saved-budgets',
      message,
    });
    this.clearMessage();
  };

  // Create budget object. Budget name is set using the Date object.
  // Name depends on current date and current number of budgets.
  getNewBudget = () => {
    const date = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + this.state.user.budgets.length
    );

    return {
      id:
        this.state.user.budgets[this.state.user.budgets.length - 1]?.id + 1 ||
        0,
      name: `${date.toLocaleString('default', {
        month: 'long',
      })} ${date.getFullYear()}`,
      projectedMonthlyIncome: 0,
      actualMonthlyIncome: 0,
      getProjectedBalance() {
        return this.projectedMonthlyIncome - this.getProjectedCost();
      },
      getActualBalance() {
        return this.actualMonthlyIncome - this.getActualCost();
      },
      getDifferenceBalance() {
        return this.getActualBalance() - this.getProjectedBalance();
      },
      getProjectedCost() {
        if (this.entries.length === 0) return 0;
        else {
          const projectedCosts = this.entries.map(
            (entry) => entry.projectedCost
          );
          return projectedCosts.reduce((acc, value) => acc + value);
        }
      },
      getActualCost() {
        if (this.entries.length === 0) return 0;
        else {
          const actualCosts = this.entries.map((entry) => entry.actualCost);
          return actualCosts.reduce((acc, value) => acc + value);
        }
      },
      getDifferenceCost() {
        return this.getProjectedCost() - this.getActualCost();
      },
      entries: [],
    };
  };

  // Event handler for view budget link.
  // Sets user.currentBudgetIndex to the selected budget's index
  // and route to 'budget'.
  handleViewBudget = (index) => {
    const stateCopy = cloneDeep(this.state);
    stateCopy.user.currentBudgetIndex = index;
    stateCopy.route = 'budget';
    this.setState(stateCopy);
  };

  handleAddBudget = () => {
    if (this.state.user.budgets.length === this.state.user.maxBudgets) {
      const message = {
        ...this.state.message,
        code: 'budgets-max-allowed',
        show: true,
      };
      this.setState({ message });
      this.clearMessage(6000);
      return;
    }
    const stateCopy = cloneDeep(this.state);
    stateCopy.user.budgets.push(this.getNewBudget());
    this.setState(stateCopy);

    if (this.state.user.budgets.length === 4) {
      const message = {
        ...this.state.message,
        code: 'budgets-created-many',
        show: true,
      };
      this.setState({ message });
      this.clearMessage(5000);
      return;
    }
    const message = {
      ...this.state.message,
      code: 'budget-created',
      show: true,
    };
    this.setState({ message });
    this.clearMessage();
  };

  // Event handler for save budgets button.
  handleSaveBudgets = () => {
    const message = {
      ...this.state.message,
      code: 'budgets-saved',
      show: true,
    };
    this.setState({ message });
    this.clearMessage();
  };

  // Update budget name if user input is not empty.
  handleFocusOutBudgetName = (text) => {
    const userCopy = cloneDeep(this.state.user);

    userCopy.budgets[this.state.user.currentBudgetIndex].name =
      text === ''
        ? userCopy.budgets[this.state.user.currentBudgetIndex].name
        : text;

    this.setState({ user: userCopy });
  };

  // Update entry category if input is not empty.
  handleFocusOutEntryCategory = (id) => (text) => {
    const userCopy = cloneDeep(this.state.user);
    const entries =
      userCopy.budgets[this.state.user.currentBudgetIndex].entries;

    const updatedEntries = entries.map((entry) => {
      if (entry.id === id) {
        entry.category = text || 'No category set';
        return entry;
      }
      return entry;
    });

    userCopy.budgets[this.state.user.currentBudgetIndex].entries =
      updatedEntries;

    this.setState({ user: userCopy });
  };

  handleFocusOutProjectedMonthlyIncome = (text) => {
    let filteredText = text;

    // Format text enclosed in parentheses as a negative number.
    // Ex '(100)' = '-100'.
    if (filteredText.startsWith('(') && filteredText.endsWith(')'))
      filteredText = filteredText.replace('(', '-').replace(')', '');

    // Remove commas. Ex '-10,000' = '10000'.
    filteredText = filteredText.replace(/,/g, '').replace(/\$/g, '');

    // If text is not a number, don't update state.
    if (isNaN(filteredText)) {
      const message = {
        ...this.state.message,
        code: 'projected-monthly-income-invalid',
        show: true,
      };
      this.setState({ message });
      this.clearMessage();
    }

    // If input is equal to current state, don't update state.
    else if (
      Math.round(filteredText * 100) / 100 ===
      this.state.user.budgets[this.state.user.currentBudgetIndex]
        .projectedMonthlyIncome
    ) {
      const message = { ...this.state.message, show: false };
      this.setState({ message });
    }
    // Update state.
    else {
      const stateCopy = cloneDeep(this.state);
      stateCopy.user.budgets[
        this.state.user.currentBudgetIndex
      ].projectedMonthlyIncome = Math.round(filteredText * 100) / 100;
      stateCopy.message.code = 'projected-monthly-income-updated';
      stateCopy.message.show = true;
      this.setState(stateCopy);
      this.clearMessage(5000);
    }
  };

  handleFocusOutActualMonthlyIncome = (text) => {
    let filteredText = text;

    if (filteredText.startsWith('(') && filteredText.endsWith(')'))
      filteredText = filteredText.replace('(', '-').replace(')', '');

    filteredText = filteredText.replace(/,/g, '').replace(/\$/g, '');

    if (isNaN(filteredText)) {
      const message = {
        ...this.state.message,
        code: 'actual-monthly-income-invalid',
        show: true,
      };
      this.setState({ message });
      this.clearMessage();
    } else if (
      Math.round(filteredText * 100) / 100 ===
      this.state.user.budgets[this.state.user.currentBudgetIndex]
        .actualMonthlyIncome
    ) {
      const message = { ...this.state.message, show: false };
      this.setState({ message });
    } else {
      const stateCopy = cloneDeep(this.state);
      stateCopy.user.budgets[
        this.state.user.currentBudgetIndex
      ].actualMonthlyIncome = Math.round(filteredText * 100) / 100;
      stateCopy.message.code = 'actual-monthly-income-updated';
      stateCopy.message.show = true;
      this.setState(stateCopy);
      this.clearMessage(5000);
    }
  };

  handleFocusOutProjectedCost = (text, index) => {
    let filteredText = text;

    if (filteredText.startsWith('(') && filteredText.endsWith(')'))
      filteredText = filteredText.replace('(', '-').replace(')', '');

    filteredText = filteredText.replace(/,/g, '').replace(/\$/g, '');

    if (isNaN(filteredText)) {
      const message = {
        ...this.state.message,
        code: 'projected-cost-invalid',
        show: true,
      };
      this.setState({ message });
      this.clearMessage();
    } else if (
      Math.round(filteredText * 100) / 100 ===
      this.state.user.budgets[this.state.user.currentBudgetIndex].entries[index]
        .projectedCost
    ) {
      const message = { ...this.state.message, show: false };
      this.setState({ message });
    } else {
      const stateCopy = cloneDeep(this.state);
      stateCopy.user.budgets[this.state.user.currentBudgetIndex].entries[
        index
      ].projectedCost = Math.round(filteredText * 100) / 100;
      stateCopy.message.show = false;

      this.setState(stateCopy);
    }
  };

  handleFocusOutActualCost = (text, index) => {
    let filteredText = text;

    if (filteredText.startsWith('(') && filteredText.endsWith(')'))
      filteredText = filteredText.replace('(', '-').replace(')', '');

    filteredText = filteredText.replace(/,/g, '').replace(/\$/g, '');

    if (isNaN(filteredText)) {
      const message = {
        ...this.state.message,
        code: 'actual-cost-invalid',
        show: true,
      };
      this.setState({ message });
      this.clearMessage();
    } else if (
      Math.round(filteredText * 100) / 100 ===
      this.state.user.budgets[this.state.user.currentBudgetIndex].entries[index]
        .actualCost
    ) {
      const message = { ...this.state.message, show: false };
      this.setState({ message });
    } else {
      const stateCopy = cloneDeep(this.state);
      stateCopy.user.budgets[this.state.user.currentBudgetIndex].entries[
        index
      ].actualCost = Math.round(filteredText * 100) / 100;
      stateCopy.message.show = false;

      this.setState(stateCopy);
    }
  };

  // Update state displayName input with user input.
  handleDisplayNameInputChange = (event) => {
    const displayName = {
      ...this.state.input.displayName,
      value: event.target.value,
      empty: false,
    };
    const input = { ...this.state.input, displayName };
    this.setState({ input });
  };

  // Update display name if display name input is different from current
  // display name and display name input is not an empty string.
  handleDisplayNameChange = () => {
    if (
      this.state.user.displayName.value !==
        this.state.input.displayName.value &&
      this.state.input.displayName.value !== ''
    ) {
      const stateCopy = cloneDeep(this.state);
      stateCopy.user.displayName = this.state.input.displayName.value;
      stateCopy.input.displayName.value = '';
      stateCopy.message.code = 'display-name-changed';
      stateCopy.message.show = true;
      this.setState(stateCopy);
      this.clearMessage();
    }
  };

  handleUsernameInputChange = (event) => {
    const username = {
      ...this.state.input.username,
      value: event.target.value,
      empty: false,
    };
    const input = { ...this.state.input, username };
    this.setState({ input });
  };

  handlePasswordInputChange = (event) => {
    const password = {
      ...this.state.input.password,
      value: event.target.value,
      empty: false,
    };
    const input = { ...this.state.input, password };
    this.setState({ input });
  };

  handleUserSignUp = () => {
    if (
      someFieldsEmpty([
        this.state.input.displayName.value,
        this.state.input.username.value,
        this.state.input.password.value,
      ])
    ) {
      let inputCopy = { ...this.state.input };
      if (this.state.input.displayName.value === '') {
        const displayName = { ...this.state.input.displayName, empty: true };
        inputCopy = { ...inputCopy, displayName };
      } else {
        const displayName = { ...this.state.input.displayName, empty: false };
        inputCopy = { ...inputCopy, displayName };
      }
      if (this.state.input.username.value === '') {
        const username = { ...this.state.input.username, empty: true };
        inputCopy = { ...inputCopy, username };
      } else {
        const username = { ...this.state.input.username, empty: false };
        inputCopy = { ...inputCopy, username };
      }
      if (this.state.input.password.value === '') {
        const password = { ...this.state.input.password, empty: true };
        inputCopy = { ...inputCopy, password };
      } else {
        const password = { ...this.state.input.password, empty: false };
        inputCopy = { ...inputCopy, password };
      }

      this.setState({ landingMessageCode: 'fields-empty', input: inputCopy });
    } else if (
      this.state.input.password.value.length <
        this.state.input.password.minLength ||
      this.state.input.password.value.length >
        this.state.input.password.maxLength
    ) {
      this.setState({ landingMessageCode: 'password-length-invalid' });
    } else this.setState({ landingMessageCode: null });
  };

  handleUserSignIn = () => {
    if (
      allFieldsEmpty([
        this.state.input.username.value,
        this.state.input.password.value,
      ])
    ) {
      const input = cloneDeep(this.state.input);
      input.username.empty = true;
      input.password.empty = true;
      this.setState({ landingMessageCode: 'fields-empty', input });
    } else if (this.state.input.username.value === '') {
      this.setState({ landingMessageCode: 'username-empty' });
      const username = { ...this.state.input.username, empty: true };
      const input = { ...this.state.input, username };
      this.setState({ input });
    } else if (this.state.input.password.value === '') {
      this.setState({ landingMessageCode: 'password-empty' });
      const password = { ...this.state.input.password, empty: true };
      const input = { ...this.state.input, password };
      this.setState({ input });
    } else if (
      this.state.input.password.value.length <
        this.state.input.password.minLength ||
      this.state.input.password.value.length >
        this.state.input.password.maxLength
    )
      this.setState({ landingMessageCode: 'credentials-invalid' });
    else {
      this.setState({ landingMessageCode: null });
    }
  };

  /**
   *
   * @param {function} callback The function to be called upon key press.
   * @param {number} keyCode JavaScript event keyCode.
   * Defaults to 13 (enter key).
   */
  handleKeyDown =
    (callback, keyCode = 13) =>
    (event) => {
      if (event.keyCode === keyCode && event.target.value !== '') callback();
    };

  render() {
    const { route, message, landingMessageCode, input, background, user } =
      this.state;

    const formattedBudget =
      user.budgets.length === 0
        ? formatBudget(this.getNewBudget(), formatterUnitedStatesDollar)
        : formatBudget(
            user.budgets[user.currentBudgetIndex],
            formatterUnitedStatesDollar
          );
    const formattedEntries = formatEntries(
      user.budgets[user.currentBudgetIndex]?.entries,
      formatterUnitedStatesDollar
    );

    const {
      entryCategory,
      projectedMonthlyIncome,
      actualMonthlyIncome,
      ...landingInput
    } = input;

    return (
      <>
        <CustomScrollbars
          classlist="bg--scrollbar-app br-pill o-90"
          heightmax="100vh"
        >
          <BackgroundWrapper background={background}>
            <div className="App clr-light ff-primary fs-body">
              <Nav
                handleRouteChange={this.handleRouteChange}
                loggedIn={user.isLoggedIn}
                isGuest={user.isGuest}
                route={route}
              />
              {route === 'signin' || route === 'signup' ? (
                <Landing
                  handleRouteChange={this.handleRouteChange}
                  route={route}
                  useDarkLanding={background.useDarkLanding}
                  handleDisplayNameInputChange={
                    this.handleDisplayNameInputChange
                  }
                  handleUsernameInputChange={this.handleUsernameInputChange}
                  handlePasswordInputChange={this.handlePasswordInputChange}
                  handleKeyDown={this.handleKeyDown}
                  handleUserSignUp={this.handleUserSignUp}
                  handleUserSignIn={this.handleUserSignIn}
                  landingMessageCode={landingMessageCode}
                  input={landingInput}
                />
              ) : route === 'budget' ? (
                <Budget
                  budget={user.budgets[user.currentBudgetIndex]}
                  handleFocusOutBudgetName={this.handleFocusOutBudgetName}
                  handleFocusProjectedMonthlyIncome={
                    this.handleFocusProjectedMonthlyIncome
                  }
                  handleFocusActualMonthlyIncome={
                    this.handleFocusActualMonthlyIncome
                  }
                  handleFocusOutProjectedMonthlyIncome={
                    this.handleFocusOutProjectedMonthlyIncome
                  }
                  handleFocusOutActualMonthlyIncome={
                    this.handleFocusOutActualMonthlyIncome
                  }
                  inputEntryCategory={input.entryCategory}
                  handleEntryCategoryInputChange={
                    this.handleEntryCategoryInputChange
                  }
                  handleKeyDown={this.handleKeyDown}
                  handleAddEntry={this.handleAddEntry}
                  handleDeleteEntry={this.handleDeleteEntry}
                  handleFocusOutEntryCategory={this.handleFocusOutEntryCategory}
                  handleFocusOutProjectedCost={this.handleFocusOutProjectedCost}
                  handleFocusOutActualCost={this.handleFocusOutActualCost}
                  handleUserClickedDeleteBudget={
                    this.handleUserClickedDeleteBudget
                  }
                  clickedDeleteBudget={user.clickedDeleteBudget}
                  handleDeleteBudget={this.handleDeleteBudget}
                  formattedBudget={formattedBudget}
                  formattedEntries={formattedEntries}
                />
              ) : route === 'saved-budgets' ? (
                <SavedBudgets
                  user={user}
                  handleViewBudget={this.handleViewBudget}
                  handleAddBudget={this.handleAddBudget}
                  handleSaveBudgets={this.handleSaveBudgets}
                  currentBudgetIndex={user.currentBudgetIndex}
                />
              ) : route === 'profile' ? (
                <Profile
                  user={user}
                  inputDisplayName={input.displayName.value}
                  handleDisplayNameInputChange={
                    this.handleDisplayNameInputChange
                  }
                  handleDisplayNameChange={this.handleDisplayNameChange}
                  handleKeyDown={this.handleKeyDown}
                  handleBackgroundChange={this.handleBackgroundChange}
                  backgrounds={backgrounds}
                  currentBackground={background}
                  maxBudgets={user.maxBudgets}
                />
              ) : route === 'about' ? (
                <About />
              ) : null}
              <CSSTransition
                in={message.show}
                classNames="message"
                timeout={500}
                unmountOnExit
              >
                <Message
                  code={message.code}
                  user={user}
                  formattedBudget={formattedBudget}
                />
              </CSSTransition>
            </div>
          </BackgroundWrapper>
        </CustomScrollbars>
        <PreloadedBackgrounds backgrounds={backgrounds} />
      </>
    );
  }
}

export default App;
