'use strict';

var searchUrl = 'http://hambarsearch.laforge.grep.ro/query';
var bucketUrl = 'https://mgax-mof.s3.amazonaws.com/';

var search = function(q, callback) {
  $.ajax({
    url: searchUrl,
    method: 'POST',
    data: JSON.stringify({
      query: {term: {text: q}},
      highlight: {fields: {text: {}}}
    }),
    dataType: 'json',
    success: callback
  });
};

var SearchResults = React.createClass({
  render: function() {
    return (
      <ul>
        {this.props.hits.map(function(hit) { return (
          <li>
            <a href={bucketUrl + hit._source.slug + '.pdf'}>
              {hit._source.slug}
            </a>
            <ul>
            {hit.highlight.text.map(function(hi) {
              return <li className="highlight" dangerouslySetInnerHTML={{__html: hi}} />
            })}
            </ul>
          </li>
        )})}
      </ul>
    );
  }
});

var Search = React.createClass({
  getInitialState: function() {
    return {hits: [], searching: false};
  },

  render: function() {
    var results = null;
    if(this.state.searching) {
      results = "searching ...";
    }
    else {
      results = <SearchResults hits={this.state.hits} />;
    }
    return (
      <div>
        <form onSubmit={this.handleSubmit} className="form-inline">
          <div className="form-group">
            <input
              type="search"
              className="form-control"
              ref="q"
              autoFocus={true}
              />
          </div>
          <button type="submit" className="btn btn-default">search</button>
        </form>
        {results}
      </div>
    );
  },

  handleSubmit: function(evt) {
    evt.preventDefault();
    var q = React.findDOMNode(this.refs.q).value;
    this.setState({searching: true});
    search(q, function(resp) {
      this.setState({hits: resp.hits.hits, searching: false});
    }.bind(this));
  }
});

React.render(<Search />, document.querySelector('#search'));
