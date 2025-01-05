import React, { Component } from 'react';
import axios from 'axios';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: 240000000,
      downPaymentPercentage: '',
      months: '',
      monthlyPayment: '',
      error: '',
    };
  }

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { price, downPaymentPercentage, months } = this.state;

    if (months > 24) {
      this.setState({ error: 'Maksimal cicilan adalah 24 bulan' });
      return;
    }

    const postData = {
      price,
      downPaymentPercentage,
      months,
    }

    this.setState({ error: '' });

    try {
      const response = await axios.post('https://7040-2400-9800-6032-cdf-b873-5ad0-1e75-7266.ngrok-free.app/credit/calculate', postData);

      const { monthlyPayment } = response.data;
      this.setState({ monthlyPayment });
    } catch (error) {
      this.setState({ error: 'Terjadi kesalahan, coba lagi nanti.' });
    }
  };

  render() {
    const { price, downPaymentPercentage, months, monthlyPayment, error } = this.state;

    return (
      <div className="container mt-5">
          <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
            <div className="col-10 col-sm-8 col-lg-6">
              <img
                src="https://imgx.gridoto.com/crop/130x0:1279x670/700x465/photo/2021/11/02/toyota-avanza-veloz-at-2011jpeg-20211102111358.jpeg"  // Ganti dengan URL gambar mobil Anda

                className="d-block mx-lg-auto img-fluid" alt="Bootstrap Themes" width="700" height="500" loading="lazy" />
            </div>
            <div className="col-lg-6">
              <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">Mobil Toyota Avanza</h1>
              <p className="lead">
                Toyota Avanza adalah salah satu mobil MPV terbaik di Indonesia yang menawarkan kenyamanan,
                efisiensi bahan bakar, dan harga yang terjangkau. Dapatkan mobil impian Anda sekarang juga dengan
                sistem kredit yang mudah dan cepat.
              </p>
            </div>
          </div>


        <h2>Perhitungan Angsuran Kredit Mobil</h2>

        <form onSubmit={this.handleSubmit} className='mb-5'>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">Harga Mobil</label>
            <input
              className="form-control"
              id="price"
              value={price}
              readOnly
            />
          </div>

          <div className="mb-3">
            <label htmlFor="downPaymentPercentage" className="form-label">Uang Muka (%)</label>
            <select
              id="downPaymentPercentage"
              className="form-select"
              value={downPaymentPercentage}
              onChange={this.handleChange}
            >
              {[10, 20, 30, 40, 50].map((i) => (
                <option key={i} value={i}>{i}%</option>
              ))}
            </select>
          </div>


          <div className="mb-3">
            <label htmlFor="months" className="form-label">Cicilan (bulan)</label>
            <input
              type="number"
              className="form-control"
              id="months"
              value={months}
              onChange={this.handleChange}
              min="1"
              max="24"
            />
            {error && <div className="text-danger">{error}</div>}
          </div>

          <button type="submit" className="btn btn-primary">Hitung Angsuran</button>
        </form>

        {monthlyPayment && (
          <div className="mt-4">
            <h4>Hasil Angsuran Per Bulan:</h4>
            <div className="alert alert-info">
              {monthlyPayment}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
