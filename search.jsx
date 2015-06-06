'use strict';

var searchUrl = 'http://hambarsearch.laforge.grep.ro/query';

class SearchResults extends React.Component {
  render() {
    return (
      <ul>
        {this.props.hits.map(function(hit) { return (
          <li>
            {hit._source.slug}
          </li>
        )})}
      </ul>
    );
  }
}

class Search extends React.Component {
  render() {
    var results = null;
    if(this.state && this.state.hits) {
      results = <SearchResults hits={this.state.hits} />;
    }
    return (
      <div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input type="search" ref="q" />
          <button type="submit">search</button>
        </form>
        {results}
      </div>
    );
  }

  handleSubmit(evt) {
    evt.preventDefault();
    var q = React.findDOMNode(this.refs.q).value;
    $.getJSON(searchUrl, {q: q}, function(resp) {
      this.setState({hits: resp.hits.hits});
    }.bind(this));
  }
}

React.render(<Search />, document.querySelector('#search'));
