'use strict';

var searchUrl = 'http://hambarsearch.laforge.grep.ro/query';
var bucketUrl = 'https://mgax-mof.s3.amazonaws.com/';

var search = function(q, callback) {
  $.ajax({
    url: searchUrl,
    method: 'POST',
    data: JSON.stringify({
      query: {term: {text: q}},
      highlight: {fields: {text: {}}},
    }),
    dataType: 'json',
    success: callback
  });
};

class SearchResults extends React.Component {
  render() {
    return (
      <ul>
        {this.props.hits.map(function(hit) { return (
          <li>
            <a href={bucketUrl + hit._source.slug + '.pdf'}>
              {hit._source.slug}
            </a>
          </li>
        )})}
      </ul>
    );
  }
}

class Search extends React.Component {
  constructor() {
    super();
    this.state = {hits: [], searching: false};
  }

  render() {
    var results = null;
    if(this.state.searching) {
      results = "searching ...";
    }
    else {
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
    this.setState({searching: true});
    search(q, function(resp) {
      this.setState({hits: resp.hits.hits, searching: false});
    }.bind(this));
  }
}

React.render(<Search />, document.querySelector('#search'));
