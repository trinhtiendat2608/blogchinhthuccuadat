document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/posts")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("posts-container");
      data.forEach(post => {
        const postDiv = document.createElement("div");
        postDiv.innerHTML = `
          <div class="post-card">
            <h2>${post.title}</h2>
            <p>${post.content.substring(0, 150)}...</p>
            <a href="post.html?id=${post._id}">Đọc tiếp</a>
          </div>
        `;
        container.appendChild(postDiv);
      });
    })
    .catch(err => console.error("Lỗi khi tải bài viết:", err));
});
