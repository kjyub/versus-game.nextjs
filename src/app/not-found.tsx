import Error from "@/components/commons/errors/Error";

export default function NotFound() {
  return (
    <div>
      <Error code="404" message="페이지를 찾을 수 없습니다." redirectUrl="/" />
    </div>
  );
}
