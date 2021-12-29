import React, { Component } from 'react'
import PropTypes from 'prop-types'
import NewsItem from './NewsItem'
import Spinner from './Spinner';

export class News extends Component {

  static defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general'
  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  }

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  constructor(props) {
    super(props);

    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0
    }
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - News App`
  }

  async updateNews() {
    this.props.setProgess(10)
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${process.env.REACT_APP_NEWS_API}&page=${this.state.page}&pageSize=${this.props.pageSize}`

    this.setState({ loading: true })

    let data = await fetch(url)
    this.props.setProgess(30)

    let parsedData = await data.json()
    this.props.setProgess(30)
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false
    })
    this.props.setProgess(100)
  }

  async componentDidMount() {
    this.updateNews()
  }

  handlePrevClick = async () => {
    this.setState({
      page: this.state.page - 1
    })
    this.updateNews()
  }

  handleNextClick = async () => {
    this.setState({
      page: this.state.page + 1
    })
    this.updateNews()
  }

  render() {
    return (
      <div className='container my-3'>
        <h1 className='text-center' style={{ margin: "30px" }}>News Updates - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h1>
        {this.state.loading && <Spinner />}
        <div className='row'>
          {!this.state.loading && this.state.articles.map((article) => {
            return (
              <div className="col-md-4" key={article.url}>
                <NewsItem
                  title={article.title ? article.title : ""}
                  description={article.description ? article.description : ""}
                  imageUrl={article.urlToImage ? article.urlToImage : "https://images.livemint.com/img/2021/12/28/600x338/Screenshot_(632)_1631643446982_1640678170758.png"}
                  newsUrl={article.url}
                  author={article.author}
                  date={article.publishedAt}
                  source={article.source.name}
                />
              </div>
            )
          })}
        </div>

        <div className='container d-flex justify-content-between'>
          <button
            type="button"
            disabled={this.state.page <= 1}
            className='btn btn-dark'
            onClick={this.handlePrevClick}
          >&larr; Previous</button>

          <button
            type="button"
            disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)}
            className='btn btn-dark'
            onClick={this.handleNextClick}
          >Next &rarr;</button>
        </div>

      </div>
    )
  }
}

export default News
