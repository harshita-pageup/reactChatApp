function MyButton({ title }: { title: string }) {
    return (
      <button>{title}</button>
    );
  }
  
  export default function Login() {
    return (
      <div className="pt-10 text-center">
        <h1>Welcome to my app</h1>
        <MyButton title="I'm a button" />
      </div>
    );
  }
