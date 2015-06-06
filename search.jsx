'use strict';

class SearchResults extends React.Component {
  render() {
    return "hello world";
  }
}

class Search extends React.Component {
  render() {
    return (
      <form>
        <input type="search" name="q" />
        <button type="submit">search</button>
      </form>
    );
  }
}

React.render(<Search />, document.querySelector('#search'));
