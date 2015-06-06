'use strict';

var searchUrl = 'http://hambarsearch.laforge.grep.ro/query';

class SearchResults extends React.Component {
  render() {
    return "hello world";
  }
}

class Search extends React.Component {
  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <input type="search" ref="q" />
        <button type="submit">search</button>
      </form>
    );
  }

  handleSubmit(evt) {
    evt.preventDefault();
    var q = React.findDOMNode(this.refs.q).value;
    $.getJSON(searchUrl, {q: q}, function(resp) {
      console.log(resp);
    }.bind(this));
  }
}

React.render(<Search />, document.querySelector('#search'));
