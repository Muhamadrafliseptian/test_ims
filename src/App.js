import React, { Component } from 'react';
import axios from 'axios';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: 240000000,
      downPaymentPercentage: '10',
      months: '',
      monthlyPayment: '',
      error: '',
      downPayment: '',
      dataJatuhTempo: '',
      dataDenda: ''
    };
  }

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  componentDidMount() {
    this.getJatuhTempo()
    this.getDenda()
  }

  async getJatuhTempo() {
    try {
      const response = await axios.post('https://7040-2400-9800-6032-cdf-b873-5ad0-1e75-7266.ngrok-free.app/query/jatuh_tempo')
      if (response.data.statusCode === 200) {
        console.log(response.data.data);
        this.setState({ dataJatuhTempo: response.data.data })
      }
    } catch (err) {

    }
  }

  async getDenda() {
    try {
      const response = await axios.post('https://7040-2400-9800-6032-cdf-b873-5ad0-1e75-7266.ngrok-free.app/query/denda')
      if (response.data.statusCode === 200) {
        console.log(response.data.data);
        this.setState({ dataDenda: response.data.data })
      }
    } catch (err) {

    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { price, downPaymentPercentage, months } = this.state;

    if (!months) {
      this.setState({ error: 'Durasi cicilan harus diisi' });
      return;
    }

    if (months > 24) {
      this.setState({ error: 'Maksimal cicilan adalah 24 bulan' });
      return;
    }

    const postData = {
      price,
      downPaymentPercentage,
      months,
    };

    this.setState({ error: '' });

    try {
      const response = await axios.post('https://7040-2400-9800-6032-cdf-b873-5ad0-1e75-7266.ngrok-free.app/credit/calculate', postData);

      const { monthlyPayment, downPayment } = response.data.data;

      this.setState({ monthlyPayment, downPayment });
    } catch (error) {
      this.setState({ error: 'Terjadi kesalahan, coba lagi nanti.' });
    }
  };

  render() {
    const { price, downPaymentPercentage, months, monthlyPayment, error, downPayment, dataJatuhTempo, dataDenda } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand-lg bg-body-tertiary rounded" aria-label="Twelfth navbar example">
          <div className="container-fluid">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample10" aria-controls="navbarsExample10" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse justify-content-md-center" id="navbarsExample10">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">IMS</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Home</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">About</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className='container'>
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


          <h2>Perhitungan Angsuran Kredit Mobil Avanza</h2>

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
              />
              {error && <div className="text-danger">{error}</div>}
            </div>

            <button type="submit" className="btn btn-primary">Hitung Angsuran</button>
          </form>

          <div className='row'>
            <div className='col-md-6'>
              {downPayment && (
                <div className="mt-4">
                  <h4>Uang Muka</h4>
                  <div className="alert alert-info">
                    {downPayment}
                  </div>
                </div>
              )}
            </div>
            <div className='col-md-6'>
              {monthlyPayment && (
                <div className="mt-4">
                  <h4>Hasil Angsuran Per Bulan:</h4>
                  <div className="alert alert-info">
                    {monthlyPayment}
                  </div>
                </div>
              )}
            </div>
          </div>
          <h2>Angsuran Jatuh Tempo</h2>

          {dataJatuhTempo.length > 0 ? (
            <table className="table table-bordered table-striped text-center">
              <thead>
                <tr>
                  <th>No. Kontrak</th>
                  <th>Nama Klien</th>
                  <th>Total Angsuran Jatuh Tempo</th>
                </tr>
              </thead>
              <tbody>
                {dataJatuhTempo.map((item, index) => (
                  <tr key={index}>
                    <td>{item.KONTRAK_NO}</td>
                    <td>{item.CLIENT_NAME}</td>
                    <td>{item.TOTAL_ANGSURAN_JATUH_TEMPO}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Data tidak tersedia.</p>
          )}

          <h2>Denda Jatuh Tempo</h2>

          {this.state.dataDenda && this.state.dataDenda.dendaPerAngsuran && this.state.dataDenda.dendaPerAngsuran.length > 0 ? (
            <table className="table table-bordered table-striped text-center">
              <thead>
                <tr>
                  <th>No. Kontrak</th>
                  <th>Nama Klien</th>
                  <th>Tanggal Jatuh Tempo</th>
                  <th>Angsuran Ke</th>
                  <th>Total Denda</th>
                </tr>
              </thead>
              <tbody>
                {this.state.dataDenda.dendaPerAngsuran.map((item, index) => (
                  <tr key={index}>
                    <td>{item.KONTRAK_NO}</td>
                    <td>{item.CLIENT_NAME}</td>
                    <td>{item.TANGGAL_JATUH_TEMPO}</td>
                    <td>{item.ANGSURAN_KE}</td> 
                    <td>{item.Denda}</td> 
                  </tr>
                ))}
                <tr>
                  <td colSpan="4"><strong>Total Denda</strong></td>
                  <td>{this.state.dataDenda.totalDenda}</td>
                </tr>
                <tr>
                  <td colSpan="4"><strong>Jumlah Angsuran Belum Dibayar</strong></td>
                  <td>{this.state.dataDenda.jumlahAngsuranBelumDibayar}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p>Data tidak tersedia.</p>
          )}

        </div>

      </div>
    );
  }
}

export default App;
