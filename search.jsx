'use strict';

var searchUrl = 'http://hambarsearch.laforge.grep.ro/query';
var bucketUrl = 'https://mgax-mof.s3.amazonaws.com/';

// Stackoverflow4life
var queryString = (function () {
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
      // If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  }
  return query_string;
})();

var search = function(q, callback) {
  $.ajax({
    url: searchUrl,
    method: 'POST',
    data: JSON.stringify({
      query: {query_string: {
        default_field: 'text',
        query: q
      }},
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


  componentDidMount: function() {
    if (queryString.q != null && queryString.q != "") {
      this.handleSubmit();
    }
  },

  render: function() {
    var results = null;

    if(this.state.searching) {
      results = "searching ...";
    } else {
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
              defaultValue={queryString.q}
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
    if (evt != null) {
      evt.preventDefault();
    }
    var q = React.findDOMNode(this.refs.q).value;
    this.setState({searching: true});
    search(q, function(resp) {
      this.setState({hits: resp.hits.hits, searching: false});
      history.replaceState(null, null, '?q=' + encodeURI(q));
    }.bind(this));
  }
});

React.render(<Search />, document.querySelector('#search'));
