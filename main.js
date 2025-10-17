// JS banner
let slideIndex = 0;
const slides = document.querySelector('.banner-slides');
let dotsContainer = document.querySelector('.dots'); // Query một lần, dùng global

// Tạo và cập nhật dots
function updateDots() {
    if (!dotsContainer) { // ← Thêm check này để tránh null
        console.warn('Dots container không tồn tại! Banner sẽ không có dots.');
        return; // Dừng hàm nếu không có .dots
    }
    dotsContainer.innerHTML = ''; // Bây giờ an toàn
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.onclick = () => moveToSlide(i);
        dotsContainer.appendChild(dot);
    }
    // Cập nhật active dot
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === slideIndex);
    });
}

function changeSlide(n) {
    slideIndex += n;
    if (slideIndex >= 3) slideIndex = 0;
    if (slideIndex < 0) slideIndex = 2;
    if (slides) slides.style.transform = `translateX(-${slideIndex * 33.33}%)`; // Thêm check slides nữa
    updateDots();
}

function moveToSlide(n) {
    slideIndex = n;
    if (slides) slides.style.transform = `translateX(-${slideIndex * 33.33}%)`;
    updateDots();
}

// Khởi tạo dots KHI HTML ĐÃ LOAD (thêm event này)
window.addEventListener('DOMContentLoaded', () => {
    dotsContainer = document.querySelector('.dots'); // Query lại sau khi load
    if (dotsContainer) {
        updateDots();
    }
});

// Tự động chuyển slide mỗi 5 giây (chỉ nếu slides tồn tại)
if (slides) {
    setInterval(() => changeSlide(1), 5000);
}

// Phần còn lại của JS giữ nguyên (class Product, fetch, v.v.)
// ...
//class sản phẩm
class Product {
    constructor(id, name, price, image, category, hot, description) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.category = category;
        this.hot = hot;
        this.description = description;
    }

    render() {
        return `<div class="product">
                <img src="${this.image}" alt="${this.name}">
                <h4>${this.name}</h4>
                <p>Giá: ${this.price.toLocaleString()} đ</p>
                <div class="product-buttons">
                    <button class="buy-now">Mua hàng</button>
                    <button class="add-to-cart" data-product-id="${this.id}">Thêm vào giỏ</button>
                </div>
            </div>`;
    }
}

//show trang chủ
const productHot = document.getElementById('product-hot');
const productLaptop = document.getElementById('product-laptop');
const productDienThoai = document.getElementById('product-dienthoai');

if (productHot) {
    fetch('https://my-json-server.typicode.com/Duy-web29/backend1/products')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            //Show mảng data vào trong thẻ content
            const dataHot = data.filter(p => p.hot === true);
            const dataLaptop = data.filter(p => p.category === "laptop");
            const dataPhone = data.filter(p => p.category === "điện thoại");

            //Show sản phẩm nổi bật
            renderProducts(dataHot, productHot);

            //show sản phẩm laptop
            renderProducts(dataLaptop, productLaptop);

            //show sản phẩm điện thoại
            renderProducts(dataPhone, productDienThoai);
        });
}
// show trang product.html
const productAll = document.getElementById('all-products');
const searchInput = document.getElementById('search-input');
const sortPrice = document.getElementById('sort-price');
let allProductsData = [];

if (productAll) {
    fetch('https://my-json-server.typicode.com/Duy-web29/backend1/products')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            //Show mảng data vào trong thẻ content
            renderProducts(data, productAll);
            allProductsData = data; // Lưu toàn bộ sản phẩm vào biến toàn cục
        });
}
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        // console.log(keyword);
        const filteredProducts = allProductsData.filter(p => p.name.toLowerCase().includes(keyword));
        // console.log(filteredProducts);
        renderProducts(filteredProducts, productAll);
    });
}
if (sortPrice) {
    sortPrice.addEventListener('change', (e) => {
        alert(e.target.value);
        if (e.target.value === "asc") {
            allProductsData.sort((a, b) => a.price - b.price);

        } else if (e.target.value === "desc") {
            allProductsData.sort((a, b) => b.price - a.price);
        }
        renderProducts(allProductsData, productAll);
    });
}

const renderProducts = (array, theDiv) => {
    // THÊM CHECK NULL TRƯỚC KHI RENDER
    if (!theDiv) {
        console.error('Không tìm thấy element để render sản phẩm');
        return;
    }

    let html = "";
    array.forEach((item) => {
        const product = new Product(
            item.id,
            item.name,
            item.price,
            item.image,
            item.category,
            item.hot,
            item.description
        )
        html += product.render();
    }
    )
    theDiv.innerHTML = html;
}
// Khi click vào sản phẩm thì chuyển đến trang chi tiết sản phẩm
document.addEventListener('click', function (e) {
    if (e.target.closest('.product')) {
        const productDiv = e.target.closest('.product');
        const productName = productDiv.querySelector('h4').innerText;
        window.location.href = `detail.html?name=${encodeURIComponent(productName)}`;
    }
});
// // show trang detail.html
// const productDetail = document.getElementById('product-detail');
// if (productDetail) {
//     const urlParams = new URLSearchParams(window.location.search); 
//     const productName = urlParams.get('name');
//     fetch('https://my-json-server.typicode.com/Duy-web29/backend1/products')
//         .then(response => response.json())
//         .then(data => {
//             const productData = data.find(p => p.name === productName);
//             if (productData) {
//                 const product = new Product(
//                     productData.id,
//                     productData.name,
//                     productData.price,
//                     productData.image,
//                     productData.category,
//                     productData.hot,
//                     productData.description
//                 );
//                 productDetail.innerHTML = `
//                     <h2>${product.name}</h2>
//                     <img src="${product.image}" alt="${product.name}">
//                     <p>Giá: ${product.price}</p>
//                     <p>${product.description}</p>
//                     <div class="product-buttons">
//                         <button class="add-to-cart">+</button>
//                         <button class="buy-now">Mua hàng</button>
//                     </div>
//                 `;
//             } else {
//                 productDetail.innerHTML = '<p>Sản phẩm không tồn tại.</p>';
//             }   
//         });
// }   
// Thêm vào file main.js, trong phần "show trang detail.html"

// show trang detail.html
const productDetail = document.getElementById('product-detail');
if (productDetail) {
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('name');
    fetch('https://my-json-server.typicode.com/Duy-web29/backend1/products')
        .then(response => response.json())
        .then(data => {
            const productData = data.find(p => p.name === productName);
            if (productData) {
                // Tạo danh sách hình ảnh liên quan (trong thực tế, bạn có thể lấy từ database)
                const relatedImages = [
                    productData.image,
                    productData.image.replace('.jpg', '_2.jpg'),
                    productData.image.replace('.jpg', '_3.jpg'),
                    productData.image.replace('.jpg', '_4.jpg')
                ].filter(img => img !== productData.image);

                // Thêm ảnh chính vào đầu danh sách
                const allImages = [productData.image, ...relatedImages];

                const product = new Product(
                    productData.id,
                    productData.name,
                    productData.price,
                    productData.image,
                    productData.category,
                    productData.hot,
                    productData.description
                );

                // Render chi tiết sản phẩm với cấu trúc mới
                productDetail.innerHTML = `
                    <div class="product-main">
                        <div class="product-images">
                            <div class="main-image">
                                <img src="${product.image}" alt="${product.name}" id="main-product-image">
                            </div>
                            <div class="thumbnail-images">
                                ${allImages.map((img, index) => `
                                    <div class="thumbnail ${index === 0 ? 'active' : ''}" data-image="${img}">
                                        <img src="${img}" alt="${product.name} - Hình ${index + 1}">
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="product-info">
                            <h1 class="product-title">${product.name}</h1>
                            <div class="product-price">${formatPrice(product.price)}</div>
                            <div class="product-rating">
                                <div class="stars">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star-half-alt"></i>
                                </div>
                                <span class="rating-count">(42 đánh giá)</span>
                            </div>
                            <div class="product-features">
                                <ul class="feature-list">
                                    <li>Bảo hành 12 tháng chính hãng</li>
                                    <li>Miễn phí giao hàng toàn quốc</li>
                                    <li>Hỗ trợ trả góp 0%</li>
                                    <li>Đổi trả trong 30 ngày</li>
                                </ul>
                            </div>
                            <div class="quantity-selector">
                                <span>Số lượng:</span>
                                <button class="quantity-btn" id="decrease-qty">-</button>
                                <input type="number" class="quantity-input" id="product-quantity" value="1" min="1" max="10">
                                <button class="quantity-btn" id="increase-qty">+</button>
                            </div>
                            <div class="action-buttons">
                                <button class="btn btn-primary buy-now">
                                    <i class="fas fa-shopping-cart"></i> Thêm vào giỏ hàng
                                </button>
                                <button class="btn btn-secondary buy-now">
                                    <i class="fas fa-bolt"></i> Mua ngay
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="product-description">
                        <h2 class="section-title">Mô tả sản phẩm</h2>
                        <div class="description-content">
                            <p>${product.description}</p>
                        </div>
                        <div class="description-grid">
                            <div class="description-item">
                                <h4>Thông số kỹ thuật</h4>
                                <p>Chi tiết thông số kỹ thuật của sản phẩm sẽ được hiển thị tại đây.</p>
                            </div>
                            <div class="description-item">
                                <h4>Chính sách bảo hành</h4>
                                <p>Sản phẩm được bảo hành chính hãng 12 tháng tại các trung tâm bảo hành trên toàn quốc.</p>
                            </div>
                            <div class="description-item">
                                <h4>Hướng dẫn sử dụng</h4>
                                <p>Tài liệu hướng dẫn sử dụng chi tiết sẽ được cung cấp kèm theo sản phẩm.</p>
                            </div>
                        </div>
                    </div>
                `;

                // Khởi tạo chức năng cho hình ảnh
                initProductImages(allImages);
                initQuantitySelector();
            } else {
                productDetail.innerHTML = '<p class="error-message">Sản phẩm không tồn tại.</p>';
            }
        });
}

// Hàm định dạng giá
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Khởi tạo chức năng cho hình ảnh sản phẩm
function initProductImages(images) {
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalClose = document.getElementById('modal-close');
    const modalPrev = document.getElementById('modal-prev');
    const modalNext = document.getElementById('modal-next');

    let currentImageIndex = 0;

    // Xử lý click thumbnail
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            // Cập nhật ảnh chính
            mainImage.src = thumb.dataset.image;

            // Cập nhật trạng thái active
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');

            // Cập nhật chỉ số ảnh hiện tại
            currentImageIndex = index;
        });
    });

    // Mở modal khi click ảnh chính
    mainImage.addEventListener('click', () => {
        modalImage.src = images[currentImageIndex];
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Đóng modal
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Đóng modal khi click bên ngoài
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Chuyển ảnh trong modal
    modalPrev.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        modalImage.src = images[currentImageIndex];
        updateThumbnailActive();
    });

    modalNext.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        modalImage.src = images[currentImageIndex];
        updateThumbnailActive();
    });

    // Cập nhật thumbnail active
    function updateThumbnailActive() {
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === currentImageIndex);
        });
    }
}

// Khởi tạo chức năng chọn số lượng
function initQuantitySelector() {
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');
    const quantityInput = document.getElementById('product-quantity');

    decreaseBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });

    increaseBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        if (value < 10) {
            quantityInput.value = value + 1;
        }
    });

    quantityInput.addEventListener('change', () => {
        let value = parseInt(quantityInput.value);
        if (isNaN(value) || value < 1) {
            quantityInput.value = 1;
        } else if (value > 10) {
            quantityInput.value = 10;
        }
    });
}
// THAY THẾ phần xử lý thêm vào giỏ hàng hiện tại bằng code này:

// Xử lý thêm vào giỏ hàng từ các trang
document.addEventListener('click', function (e) {
    // Xử lý nút thêm vào giỏ hàng trên trang sản phẩm
    if (e.target.classList.contains('add-to-cart')) {
        e.preventDefault();
        e.stopPropagation();

        const productId = e.target.getAttribute('data-product-id');
        console.log('Click add to cart, product ID:', productId); // Debug

        if (productId) {
            fetch(`https://my-json-server.typicode.com/Duy-web29/backend1/products/${productId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(item => {
                    console.log('Product data:', item); // Debug
                    const product = new Product(
                        item.id,
                        item.name,
                        item.price,
                        item.image,
                        item.category,
                        item.hot,
                        item.description
                    );
                    cart.addItem(product);
                })
                .catch(error => {
                    console.error('Lỗi khi thêm vào giỏ hàng:', error);
                    // Sử dụng hàm showNotification toàn cục
                    if (typeof showNotification === 'function') {
                        showNotification('Lỗi khi thêm sản phẩm vào giỏ hàng!', 'error');
                    }
                });
        }
    }
});



// ========== PHẦN MỚI: QUẢN LÝ ĐĂNG NHẬP ==========

// Biến toàn cục để lưu thông tin người dùng hiện tại
let currentUser = null;

// Khởi tạo chức năng đăng nhập khi DOM đã load
document.addEventListener('DOMContentLoaded', function () {
    initLoginSystem();
    checkUserLoginStatus();
});

// Khởi tạo hệ thống đăng nhập
function initLoginSystem() {
    // Lấy các phần tử DOM
    const loginPopup = document.getElementById('login-popup');
    const userIcon = document.getElementById('user-icon');
    const loginCloseBtn = document.getElementById('login-close-btn');
    const signUpButton = document.getElementById('login-sign-up');
    const signInButton = document.getElementById('login-sign-in');
    const loginContainer = document.getElementById('login-container');
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');

    // Mở popup đăng nhập khi click vào icon user
    if (userIcon) {
        userIcon.addEventListener('click', function (e) {
            e.preventDefault();
            if (currentUser) {
                // Nếu đã đăng nhập, chuyển đến trang profile
                window.location.href = 'profile.html';
            } else {
                // Nếu chưa đăng nhập, hiển thị popup
                loginPopup.classList.remove('hidden');
                // Reset form khi mở popup
                document.getElementById('signin-form').reset();
                document.getElementById('signup-form').reset();
            }
        });
    }

    // Đóng popup đăng nhập
    if (loginCloseBtn) {
        loginCloseBtn.addEventListener('click', function () {
            loginPopup.classList.add('hidden');
        });
    }

    // Đóng popup khi click bên ngoài
    if (loginPopup) {
        loginPopup.addEventListener('click', function (e) {
            if (e.target === loginPopup) {
                loginPopup.classList.add('hidden');
            }
        });
    }

    // Chuyển đổi giữa đăng nhập và đăng ký
    if (signUpButton) {
        signUpButton.addEventListener('click', function () {
            loginContainer.classList.add("right-panel-active");
        });
    }

    if (signInButton) {
        signInButton.addEventListener('click', function () {
            loginContainer.classList.remove("right-panel-active");
        });
    }

    // Xử lý đăng nhập
    if (signinForm) {
        signinForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('signin-email').value;
            const password = document.getElementById('signin-password').value;
            loginUser(email, password);
        });
    }

    // Xử lý đăng ký
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            registerUser(name, email, password);
        });
    }
}



// Đăng nhập người dùng
function loginUser(email, password) {
    fetch('https://my-json-server.typicode.com/Duy-web29/backend1/users')
        .then(response => response.json())
        .then(users => {
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                // Lưu thông tin người dùng vào localStorage
                localStorage.setItem('currentUser', JSON.stringify(user));
                currentUser = user;

                // Hiển thị thông báo thành công
                showNotification('Đăng nhập thành công!', 'success');

                // Đóng popup đăng nhập
                document.getElementById('login-popup').classList.add('hidden');

                // Cập nhật giao diện header
                updateUserInterface();
            } else {
                showNotification('Email hoặc mật khẩu không chính xác!', 'error');
            }
        })
        .catch(error => {
            console.error('Lỗi khi đăng nhập:', error);
            showNotification('Đã xảy ra lỗi khi đăng nhập!', 'error');
        });
}

// Đăng ký người dùng mới
function registerUser(name, email, password) {
    fetch('https://my-json-server.typicode.com/Duy-web29/backend1/users')
        .then(response => response.json())
        .then(users => {
            // Kiểm tra xem email đã tồn tại chưa
            const existingUser = users.find(u => u.email === email);
            if (existingUser) {
                showNotification('Email đã được sử dụng!', 'error');
                return;
            }

            // Tạo người dùng mới
            const newUser = {
                id: users.length + 1,
                name: name,
                email: email,
                password: password,
                role: 'customer',
                registered_at: new Date().toISOString().split('T')[0]
            };

            // Gửi yêu cầu POST để thêm người dùng mới
            fetch('https://my-json-server.typicode.com/Duy-web29/backend1/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            })
                .then(response => response.json())
                .then(user => {
                    showNotification('Đăng ký thành công! Vui lòng đăng nhập.', 'success');

                    // Chuyển sang form đăng nhập
                    document.getElementById('login-container').classList.remove("right-panel-active");

                    // Reset form đăng ký
                    document.getElementById('signup-form').reset();
                })
                .catch(error => {
                    console.error('Lỗi khi đăng ký:', error);
                    showNotification('Đã xảy ra lỗi khi đăng ký!', 'error');
                });
        })
        .catch(error => {
            console.error('Lỗi khi đăng ký:', error);
            showNotification('Đã xảy ra lỗi khi đăng ký!', 'error');
        });
}

// Kiểm tra trạng thái đăng nhập
function checkUserLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserInterface();
    }
}

// Cập nhật giao diện người dùng
function updateUserInterface() {
    const userInfoDiv = document.getElementById('user-info');
    if (userInfoDiv && currentUser) {
        userInfoDiv.innerHTML = `
            <div class="user-info">
                <div class="user-avatar">${currentUser.name.charAt(0).toUpperCase()}</div>
                <span class="user-name">${currentUser.name}</span>
                <a href="profile.html" class="user-link">
                    <i class="fas fa-user"></i>
                </a>
            </div>
        `;
    }
}

// Hiển thị thông báo
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');

    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Đăng xuất
function logoutUser() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    showNotification('Đã đăng xuất!', 'success');

    // Cập nhật giao diện
    const userInfoDiv = document.getElementById('user-info');
    if (userInfoDiv) {
        userInfoDiv.innerHTML = `
            <a href="#" id="user-icon" class="user-link">
                <i class="fas fa-user"></i>
            </a>
        `;

        // Gắn lại sự kiện cho icon user mới
        const newUserIcon = document.getElementById('user-icon');
        if (newUserIcon) {
            newUserIcon.addEventListener('click', function (e) {
                e.preventDefault();
                document.getElementById('login-popup').classList.remove('hidden');
            });
        }
    }
}

// ========== PHẦN CHO TRANG PROFILE ==========

// Hiển thị thông tin người dùng trên trang profile
const profileInfo = document.getElementById('profile-info');
const logoutBtn = document.getElementById('logout-btn');

// TRONG PHẦN PROFILE, THÊM ĐOẠN NÀY
if (profileInfo) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        profileInfo.innerHTML = `
            <p><strong>Họ tên:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Vai trò:</strong> ${user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</p>
            <p><strong>Ngày đăng ký:</strong> ${user.registered_at}</p>
        `;
        
        // HIỆN NÚT ADMIN NẾU LÀ ADMIN
        const adminSection = document.getElementById('admin-section');
        if (adminSection && user.role === 'admin') {
            adminSection.style.display = 'block';
        }
    } else {
        profileInfo.innerHTML = '<p>Bạn chưa đăng nhập. <a href="index.html">Quay lại trang chủ</a></p>';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

// Xử lý đăng xuất trên trang profile
if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
        logoutUser();
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    });
}


// ========== CLASS CART ==========
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.updateCartCount();
        this.setupEventListeners();
    }

    // Thêm sản phẩm vào giỏ hàng
    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id == product.id);
        
        if (existingItem) {
            // Nếu sản phẩm đã có trong giỏ, tăng số lượng
            existingItem.quantity += quantity;
        } else {
            // Nếu sản phẩm chưa có, thêm mới
            this.items.push({
                ...product,
                quantity: quantity
            });
        }
        
        this.saveToLocalStorage();
        this.updateCartCount();
        this.showNotification('Đã thêm sản phẩm vào giỏ hàng!', 'success');

        // Nếu đang ở trang giỏ hàng, render lại
        if (window.location.pathname.includes('cart.html')) {
            this.renderCartPage();
        }
    }

    // Xóa sản phẩm khỏi giỏ hàng
    removeItem(productId) {
        this.items = this.items.filter(item => item.id != productId);
        this.saveToLocalStorage();
        this.updateCartCount();
        this.showNotification('Đã xóa sản phẩm khỏi giỏ hàng!', 'success');

        if (window.location.pathname.includes('cart.html')) {
            this.renderCartPage();
        }
    }

    // Cập nhật số lượng sản phẩm
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id == productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveToLocalStorage();
                this.updateCartCount();

                if (window.location.pathname.includes('cart.html')) {
                    this.renderCartPage();
                }
            }
        }
    }

    // Xóa toàn bộ giỏ hàng
    clearCart() {
        this.items = [];
        this.saveToLocalStorage();
        this.updateCartCount();
        this.showNotification('Đã xóa toàn bộ giỏ hàng!', 'success');

        if (window.location.pathname.includes('cart.html')) {
            this.renderCartPage();
        }
    }

    // Tính tổng tiền
    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Tính tổng số lượng sản phẩm
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Lưu vào localStorage
    saveToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    // Cập nhật số lượng hiển thị trên icon giỏ hàng
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const totalItems = this.getTotalItems();

        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });

        // Cập nhật cả link giỏ hàng
        const cartLinks = document.querySelectorAll('.cart-link');
        cartLinks.forEach(link => {
            link.innerHTML = `<i class="fas fa-shopping-cart"></i> <span class="cart-count">${totalItems}</span>`;
        });
    }

    // Hiển thị thông báo
    showNotification(message, type = 'success') {
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            // Fallback notification
            const notification = document.getElementById('notification');
            if (notification) {
                notification.textContent = message;
                notification.className = `notification ${type}`;
                notification.classList.remove('hidden');

                setTimeout(() => {
                    notification.classList.add('hidden');
                }, 3000);
            } else {
                console.log(`${type}: ${message}`);
            }
        }
    }

    // Render trang giỏ hàng
    renderCartPage() {
        const cartContent = document.getElementById('cart-content');
        if (!cartContent) return;

        if (this.items.length === 0) {
            cartContent.innerHTML = this.renderEmptyCart();
            return;
        }

        cartContent.innerHTML = this.renderCartTable();
        this.attachCartEventListeners();
    }

    // Render giỏ hàng trống
    renderEmptyCart() {
        return `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <h3>Giỏ hàng của bạn đang trống</h3>
                <p>Hãy thêm một số sản phẩm để bắt đầu mua sắm!</p>
                <a href="product.html" class="btn btn-primary">Tiếp tục mua sắm</a>
            </div>
        `;
    }

    // Render bảng giỏ hàng
    renderCartTable() {
        return `
            <h2 class="cart-title">Giỏ hàng của bạn</h2>
            <div class="cart-table">
                <div class="cart-header">
                    <div class="cart-col-product">Sản phẩm</div>
                    <div class="cart-col-price">Đơn giá</div>
                    <div class="cart-col-quantity">Số lượng</div>
                    <div class="cart-col-total">Thành tiền</div>
                    <div class="cart-col-action">Thao tác</div>
                </div>
                
                ${this.items.map(item => `
                    <div class="cart-item" data-product-id="${item.id}">
                        <div class="cart-col-product">
                            <img src="${item.image}" alt="${item.name}" class="cart-product-image">
                            <div class="product-info">
                                <h4>${item.name}</h4>
                                <p class="product-category">${item.category}</p>
                            </div>
                        </div>
                        <div class="cart-col-price">${this.formatPrice(item.price)}</div>
                        <div class="cart-col-quantity">
                            <div class="quantity-controls">
                                <button class="quantity-btn decrease" data-product-id="${item.id}">-</button>
                                <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" data-product-id="${item.id}">
                                <button class="quantity-btn increase" data-product-id="${item.id}">+</button>
                            </div>
                        </div>
                        <div class="cart-col-total">${this.formatPrice(item.price * item.quantity)}</div>
                        <div class="cart-col-action">
                            <button class="btn-remove" data-product-id="${item.id}" title="Xóa sản phẩm">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
                
                <div class="cart-summary">
                    <div class="cart-total">
                        <h3>Tổng cộng: ${this.formatPrice(this.getTotalPrice())}</h3>
                        <p class="total-items">Tổng số sản phẩm: ${this.getTotalItems()}</p>
                    </div>
                    <div class="cart-actions">
                        <a href="product.html" class="btn btn-outline">Tiếp tục mua sắm</a>
                        <button class="btn btn-primary" id="checkout-btn">Thanh toán</button>
                        <button class="btn btn-secondary" id="clear-cart-btn">Xóa giỏ hàng</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Gắn sự kiện cho giỏ hàng
    attachCartEventListeners() {
        // Tăng số lượng
        document.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.increase').getAttribute('data-product-id');
                const item = this.items.find(item => item.id == productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            });
        });

        // Giảm số lượng
        document.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.decrease').getAttribute('data-product-id');
                const item = this.items.find(item => item.id == productId);
                if (item && item.quantity > 1) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            });
        });

        // Thay đổi số lượng trực tiếp
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = e.target.getAttribute('data-product-id');
                const quantity = parseInt(e.target.value);
                if (!isNaN(quantity) && quantity > 0) {
                    this.updateQuantity(productId, quantity);
                } else {
                    // Nếu số lượng không hợp lệ, reset về 1
                    e.target.value = 1;
                    this.updateQuantity(productId, 1);
                }
            });

            // Ngăn nhập số âm
            input.addEventListener('keydown', (e) => {
                if (e.key === '-' || e.key === 'e') {
                    e.preventDefault();
                }
            });
        });

        // Xóa sản phẩm
        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.btn-remove').getAttribute('data-product-id');
                if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
                    this.removeItem(productId);
                }
            });
        });

        // Xóa toàn bộ giỏ hàng
        const clearCartBtn = document.getElementById('clear-cart-btn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                if (confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
                    this.clearCart();
                }
            });
        }

        // Thanh toán
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.items.length === 0) {
                    this.showNotification('Giỏ hàng trống!', 'error');
                    return;
                }
                
                // Kiểm tra đăng nhập
                const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
                if (!currentUser) {
                    this.showNotification('Vui lòng đăng nhập để thanh toán!', 'error');
                    document.getElementById('login-popup')?.classList.remove('hidden');
                    return;
                }

                this.showNotification('Tính năng thanh toán đang được phát triển!', 'success');
            });
        }
    }

    // Định dạng giá tiền
    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }

    // Thiết lập event listeners toàn cục
    setupEventListeners() {
        // Xử lý thêm vào giỏ hàng từ các trang
        document.addEventListener('click', (e) => {
            // Nút thêm vào giỏ hàng trên danh sách sản phẩm
            if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
                e.preventDefault();
                e.stopPropagation();

                const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
                const productId = button.getAttribute('data-product-id');
                
                if (productId) {
                    this.handleAddToCart(productId);
                }
            }

            // Nút thêm vào giỏ hàng trên trang chi tiết
            if (e.target.closest('.btn-primary') && e.target.closest('.action-buttons')) {
                const productElement = document.querySelector('.product-main');
                if (productElement) {
                    const productName = document.querySelector('.product-title')?.textContent;
                    if (productName) {
                        this.handleAddToCartFromDetail(productName);
                    }
                }
            }
        });
    }

    // Xử lý thêm vào giỏ hàng từ danh sách sản phẩm
    async handleAddToCart(productId) {
        try {
            const response = await fetch(`https://my-json-server.typicode.com/Duy-web29/backend1/products/${productId}`);
            if (!response.ok) throw new Error('Không tìm thấy sản phẩm');
            
            const productData = await response.json();
            const product = new Product(
                productData.id,
                productData.name,
                productData.price,
                productData.image,
                productData.category,
                productData.hot,
                productData.description
            );
            
            this.addItem(product);
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
            this.showNotification('Lỗi khi thêm sản phẩm vào giỏ hàng!', 'error');
        }
    }

    // Xử lý thêm vào giỏ hàng từ trang chi tiết
    async handleAddToCartFromDetail(productName) {
        try {
            const response = await fetch('https://my-json-server.typicode.com/Duy-web29/backend1/products');
            const products = await response.json();
            const productData = products.find(p => p.name === productName);
            
            if (productData) {
                const product = new Product(
                    productData.id,
                    productData.name,
                    productData.price,
                    productData.image,
                    productData.category,
                    productData.hot,
                    productData.description
                );
                
                const quantity = parseInt(document.getElementById('product-quantity')?.value || 1);
                this.addItem(product, quantity);
            }
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
            this.showNotification('Lỗi khi thêm sản phẩm vào giỏ hàng!', 'error');
        }
    }
}

// Tạo instance giỏ hàng toàn cục
const cart = new Cart();


// Hàm tạo header
function createHeader() {
    const header = document.createElement('header');
    
    // Kiểm tra admin
    let adminLink = '';
    try {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            if (user.role === 'admin') {
                adminLink = '<a href="admin.html" class="admin-link">Quản Lý</a>';
            }
        }
    } catch (e) {
        console.log('Không thể parse user data');
    }
    
    header.innerHTML = `
        <div class="logo" href="index.html">▲LuminusX</div>
        
        <nav>
            <a href="index.html">Trang chủ</a>
    <a href="#about">Về chúng tôi</a>
    <a href="#news">Tin tức</a>
    <a href="product.html">Sản phẩm</a>
    <a href="#contacts">Liên hệ</a>
            ${adminLink}
            <a href="#" id="user-icon" class="user-link">
                <i class="fas fa-user"></i>
            </a>
            <a href="cart.html" class="cart-link">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-count">${cart.getTotalItems()}</span>
            </a>
        </nav>
    `;
    
    return header;
}

// Sử dụng
const header = createHeader();
document.body.prepend(header);
// Tạo footer để thêm vào tất cả các trang
const footer = document.createElement('footer');
footer.innerHTML = `
        <div class="footer-container">
            <!-- Cột 1: Liên kết nhanh -->
            <div class="footer-section">
                <h3>Liên kết nhanh</h3>
                <ul>
                    <li><a href="index.html">Trang chủ</a></li>
                    <li><a href="product.html">Sản phẩm</a></li>
                    <li><a href="#">Về chúng tôi</a></li>
                    <li><a href="#">Tin tức</a></li>
                    <li><a href="#">Liên hệ</a></li>
                </ul>
            </div>

            <!-- Cột 2: Thông tin liên hệ -->
            <div class="footer-section">
                <h3>Liên hệ</h3>
                <p><strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP. HCM</p>
                <p><strong>Email:</strong> info@luminusx.com</p>
                <p><strong>SĐT:</strong> 0123 456 789</p>
                <p><strong>Giờ làm việc:</strong> 8:00 - 22:00</p>
            </div>

            <!-- Cột 3: Mạng xã hội -->
            <div class="footer-section">
                <h3>Theo dõi chúng tôi</h3>
                <div class="social-links">
                    <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i> Facebook</a>
                    <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i> Instagram</a>
                    <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i> Twitter</a>
                </div>
                <p>Nhận ưu đãi qua newsletter:</p>
                <form class="newsletter">
                    <input type="email" placeholder="Nhập email của bạn">
                    <button type="submit">Đăng ký</button>
                </form>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 LuminusX. All rights reserved. | <a href="#">Chính sách bảo mật</a> | <a href="#">Điều khoản
                    dịch vụ</a></p>
        </div>
`
document.body.appendChild(footer);

// Khởi tạo giỏ hàng khi DOM load
document.addEventListener('DOMContentLoaded', function () {
    // Cập nhật số lượng giỏ hàng
    cart.updateCartCount();

    // Render trang giỏ hàng nếu đang ở cart.html
    if (window.location.pathname.includes('cart.html')) {
        cart.renderCartPage();
    }

    // Thêm event listener cho nút mua hàng trên trang chi tiết
    const buyNowButtons = document.querySelectorAll('.buy-now');
    buyNowButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productElement = this.closest('.product');
            if (productElement) {
                const productName = productElement.querySelector('h4').textContent;
                window.location.href = `detail.html?name=${encodeURIComponent(productName)}`;
            }
        });
    });
});




// ========== PHẦN QUẢN LÝ SẢN PHẨM CHO ADMIN ==========

class ProductManager {
    constructor() {
        this.products = [];
        this.currentEditingProduct = null;
        this.selectedImageFile = null;
        this.init();
    }

    init() {
        this.loadProducts();
        this.attachEventListeners();
    }

    // Tải danh sách sản phẩm
    loadProducts() {
        fetch('https://my-json-server.typicode.com/Duy-web29/backend1/products')
            .then(response => response.json())
            .then(data => {
                this.products = data;
                this.renderProductTable();
            })
            .catch(error => {
                console.error('Lỗi khi tải sản phẩm:', error);
                this.showNotification('Lỗi khi tải danh sách sản phẩm!', 'error');
            });
    }

    // Render bảng sản phẩm
    renderProductTable() {
        const productTable = document.getElementById('admin-product-table');
        if (!productTable) return;

        if (this.products.length === 0) {
            productTable.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">Không có sản phẩm nào</td>
                </tr>
            `;
            return;
        }

        productTable.innerHTML = this.products.map(product => `
            <tr data-product-id="${product.id}">
                <td>
                    <img src="${product.image}" alt="${product.name}" class="product-thumbnail">
                </td>
                <td>${product.name}</td>
                <td>${this.formatPrice(product.price)}</td>
                <td>${product.category}</td>
                <td>
                    <span class="badge ${product.hot ? 'badge-hot' : 'badge-normal'}">
                        ${product.hot ? 'Nổi bật' : 'Thường'}
                    </span>
                </td>
                <td>
                    <button class="btn-edit" data-product-id="${product.id}">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="btn-delete" data-product-id="${product.id}">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </td>
            </tr>
        `).join('');

        this.attachTableEventListeners();
    }

    // Gắn sự kiện cho bảng
    attachTableEventListeners() {
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.btn-edit').getAttribute('data-product-id');
                this.editProduct(productId);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.btn-delete').getAttribute('data-product-id');
                this.deleteProduct(productId);
            });
        });
    }

    // Gắn sự kiện chung
    attachEventListeners() {
        // Nút thêm sản phẩm
        const addProductBtn = document.getElementById('add-product-btn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => {
                this.showProductModal();
            });
        }

        // Đóng modal
        const modalClose = document.getElementById('product-modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.hideProductModal();
            });
        }

        // Lưu sản phẩm
        const saveProductBtn = document.getElementById('save-product-btn');
        if (saveProductBtn) {
            saveProductBtn.addEventListener('click', () => {
                this.saveProduct();
            });
        }

        // Upload hình ảnh
        const imageUpload = document.getElementById('product-image-upload');
        if (imageUpload) {
            imageUpload.addEventListener('change', (e) => {
                this.handleImageUpload(e);
            });
        }

        // Xem trước hình ảnh
        const previewImage = document.getElementById('preview-image');
        if (previewImage) {
            previewImage.addEventListener('click', () => {
                document.getElementById('product-image-upload').click();
            });
        }

        // Đóng modal khi click bên ngoài
        const productModal = document.getElementById('product-modal');
        if (productModal) {
            productModal.addEventListener('click', (e) => {
                if (e.target === productModal) {
                    this.hideProductModal();
                }
            });
        }
    }

    // Xử lý upload hình ảnh
    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            // Kiểm tra loại file
            if (!file.type.match('image.*')) {
                this.showNotification('Vui lòng chọn file hình ảnh!', 'error');
                return;
            }

            // Kiểm tra kích thước file (tối đa 5MB)
            if (file.size > 5 * 1024 * 1024) {
                this.showNotification('Kích thước file không được vượt quá 5MB!', 'error');
                return;
            }

            this.selectedImageFile = file;
            
            // Hiển thị preview
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewImage = document.getElementById('preview-image');
                const uploadText = document.getElementById('upload-text');
                
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                uploadText.style.display = 'none';
                
                // Hiển thị tên file
                const fileName = document.getElementById('file-name');
                fileName.textContent = file.name;
                fileName.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }

    // Hiển thị modal thêm/sửa sản phẩm
    showProductModal(product = null) {
        const modal = document.getElementById('product-modal');
        const modalTitle = document.getElementById('product-modal-title');
        const form = document.getElementById('product-form');

        // Reset form và hình ảnh
        this.resetImagePreview();

        if (product) {
            // Chế độ sửa
            modalTitle.textContent = 'Sửa sản phẩm';
            this.currentEditingProduct = product;
            this.populateForm(product);
        } else {
            // Chế độ thêm
            modalTitle.textContent = 'Thêm sản phẩm mới';
            this.currentEditingProduct = null;
            form.reset();
        }

        modal.classList.remove('hidden');
    }

    // Reset preview hình ảnh
    resetImagePreview() {
        this.selectedImageFile = null;
        
        const previewImage = document.getElementById('preview-image');
        const uploadText = document.getElementById('upload-text');
        const fileName = document.getElementById('file-name');
        
        previewImage.src = '';
        previewImage.style.display = 'none';
        uploadText.style.display = 'flex';
        fileName.style.display = 'none';
        
        // Reset input file
        const imageUpload = document.getElementById('product-image-upload');
        if (imageUpload) {
            imageUpload.value = '';
        }
    }

    // Ẩn modal
    hideProductModal() {
        const modal = document.getElementById('product-modal');
        modal.classList.add('hidden');
        this.currentEditingProduct = null;
        this.selectedImageFile = null;
        this.resetImagePreview();
    }

    // Điền dữ liệu vào form
    populateForm(product) {
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-hot').checked = product.hot;

        // Hiển thị hình ảnh hiện tại
        const previewImage = document.getElementById('preview-image');
        const uploadText = document.getElementById('upload-text');
        const fileName = document.getElementById('file-name');
        
        previewImage.src = product.image;
        previewImage.style.display = 'block';
        uploadText.style.display = 'none';
        fileName.textContent = 'Hình ảnh hiện tại';
        fileName.style.display = 'block';
    }

    // Sửa sản phẩm
    editProduct(productId) {
        const product = this.products.find(p => p.id == productId);
        if (product) {
            this.showProductModal(product);
        }
    }

    // Xóa sản phẩm
    deleteProduct(productId) {
        if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            fetch(`https://my-json-server.typicode.com/Duy-web29/backend1/products/${productId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    this.showNotification('Xóa sản phẩm thành công!', 'success');
                    this.loadProducts();
                } else {
                    throw new Error('Lỗi khi xóa sản phẩm');
                }
            })
            .catch(error => {
                console.error('Lỗi khi xóa sản phẩm:', error);
                this.showNotification('Lỗi khi xóa sản phẩm!', 'error');
            });
        }
    }

    // Lưu sản phẩm (thêm hoặc sửa)
    saveProduct() {
        const formData = this.getFormData();
        
        if (!this.validateForm(formData)) {
            return;
        }

        // Nếu có hình ảnh mới được chọn, xử lý upload trước
        if (this.selectedImageFile) {
            this.uploadImage().then(imageUrl => {
                formData.image = imageUrl;
                this.saveProductData(formData);
            }).catch(error => {
                console.error('Lỗi khi upload hình ảnh:', error);
                this.showNotification('Lỗi khi upload hình ảnh!', 'error');
            });
        } else {
            // Nếu không có hình ảnh mới, giữ nguyên hình ảnh cũ (trong trường hợp sửa)
            if (this.currentEditingProduct) {
                formData.image = this.currentEditingProduct.image;
            }
            this.saveProductData(formData);
        }
    }

    // Upload hình ảnh lên server
    uploadImage() {
        return new Promise((resolve, reject) => {
            if (!this.selectedImageFile) {
                reject(new Error('Không có file hình ảnh'));
                return;
            }

            // Trong thực tế, bạn sẽ gửi file đến server
            // Ở đây chúng ta giả lập bằng cách tạo URL local
            const reader = new FileReader();
            reader.onload = (e) => {
                // Tạo tên file duy nhất
                const timestamp = new Date().getTime();
                const fileName = `product_${timestamp}_${this.selectedImageFile.name}`;
                const imageUrl = `img/uploads/${fileName}`;
                
                // Trong môi trường thực tế, bạn sẽ gửi file đến server
                // và nhận về URL thực. Ở đây chúng ta dùng base64 tạm thời
                // hoặc có thể lưu trực tiếp vào JSON server nếu hỗ trợ
                
                // Giả lập thành công và trả về URL
                setTimeout(() => {
                    // Trong demo, chúng ta dùng base64 URL
                    resolve(e.target.result);
                }, 500);
            };
            reader.onerror = () => reject(new Error('Lỗi đọc file'));
            reader.readAsDataURL(this.selectedImageFile);
        });
    }

    // Lưu dữ liệu sản phẩm
    saveProductData(productData) {
        if (this.currentEditingProduct) {
            // Cập nhật sản phẩm
            this.updateProduct(productData);
        } else {
            // Thêm sản phẩm mới
            this.addProduct(productData);
        }
    }

    // Lấy dữ liệu từ form
    getFormData() {
        return {
            name: document.getElementById('product-name').value,
            price: parseInt(document.getElementById('product-price').value),
            category: document.getElementById('product-category').value,
            description: document.getElementById('product-description').value,
            hot: document.getElementById('product-hot').checked
        };
    }

    // Validate form
    validateForm(data) {
        if (!data.name.trim()) {
            this.showNotification('Vui lòng nhập tên sản phẩm!', 'error');
            return false;
        }
        if (!data.price || data.price <= 0) {
            this.showNotification('Vui lòng nhập giá hợp lệ!', 'error');
            return false;
        }
        if (!data.category.trim()) {
            this.showNotification('Vui lòng chọn danh mục!', 'error');
            return false;
        }
        if (!this.currentEditingProduct && !this.selectedImageFile) {
            this.showNotification('Vui lòng chọn hình ảnh sản phẩm!', 'error');
            return false;
        }
        return true;
    }

    // Thêm sản phẩm mới
    addProduct(productData) {
        const newId = Math.max(...this.products.map(p => parseInt(p.id))) + 1;

        const newProduct = {
            ...productData,
            id: newId.toString()
        };

        fetch('https://my-json-server.typicode.com/Duy-web29/backend1/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        })
        .then(response => response.json())
        .then(product => {
            this.showNotification('Thêm sản phẩm thành công!', 'success');
            this.hideProductModal();
            this.loadProducts();
        })
        .catch(error => {
            console.error('Lỗi khi thêm sản phẩm:', error);
            this.showNotification('Lỗi khi thêm sản phẩm!', 'error');
        });
    }

    // Cập nhật sản phẩm
    updateProduct(productData) {
        const updatedProduct = {
            ...productData,
            id: this.currentEditingProduct.id
        };

        fetch(`https://my-json-server.typicode.com/Duy-web29/backend1/products/${this.currentEditingProduct.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
        })
        .then(response => response.json())
        .then(product => {
            this.showNotification('Cập nhật sản phẩm thành công!', 'success');
            this.hideProductModal();
            this.loadProducts();
        })
        .catch(error => {
            console.error('Lỗi khi cập nhật sản phẩm:', error);
            this.showNotification('Lỗi khi cập nhật sản phẩm!', 'error');
        });
    }

    // Định dạng giá
    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }

    // Hiển thị thông báo
    showNotification(message, type) {
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Khởi tạo quản lý sản phẩm khi DOM đã load
document.addEventListener('DOMContentLoaded', function() {
    const adminSection = document.getElementById('admin-section');
    if (adminSection) {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            if (user.role === 'admin') {
                window.productManager = new ProductManager();
            }
        }
    }
});